const { discoverFiles, discoverVendors } = require('./driveDiscovery');
const { parseCatalogFile } = require('./fileParseService');
const { enrichSourceRowWithModel } = require('./modelEnrichmentService');
const { parseStockValue } = require('../parse/stockInferer');
const { normalizeTokens } = require('../extract/normalizers');
const {
  deleteRowsByFile,
  deleteSourcesByFile,
  deleteOrphanProducts,
} = require('../persistence/catalogDb');

function slugify(value) {
  if (!value) return null;
  return value
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeKey(value) {
  if (!value) return null;
  return value
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeBrandToken(value) {
  return normalizeTokens(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function buildBrandMap(rows) {
  const brandMap = new Map();
  rows.forEach((row) => {
    const raw = row.rawRow || {};
    const brandValue =
      raw.brand ||
      raw.marca ||
      raw.marca_producto ||
      raw.brand_name ||
      raw.marca_producto_nombre;
    if (!brandValue) return;
    const label = normalizeTokens(brandValue);
    if (!label) return;
    const key = normalizeBrandToken(label);
    if (!key) return;
    if (!brandMap.has(key)) {
      brandMap.set(key, label);
    }
  });
  return brandMap;
}

function inferBrandFromText(text, brandMap) {
  if (!text || brandMap.size === 0) return null;
  const normalizedText = normalizeBrandToken(text);
  for (const [key, label] of brandMap.entries()) {
    if (normalizedText.includes(key)) {
      return label;
    }
  }
  return null;
}

function inferModelFromRow(rawRow) {
  if (!rawRow) return null;
  const candidate =
    rawRow.product ||
    rawRow.producto ||
    rawRow.model ||
    rawRow.modelo ||
    rawRow.description ||
    rawRow.descripcion ||
    rawRow.code ||
    rawRow.codigo;
  const normalized = normalizeTokens(candidate || '');
  return normalized.length >= 2 ? normalized : null;
}

async function runCatalogSync({
  syncRunRepo,
  driveClient,
  vendorRepo,
  sourceFileRepo,
  sourceRowRepo,
  issueRepo,
  catalogProductRepo,
  catalogSourceRepo,
  maxFilesPerVendor,
  maxRowsPerFile,
  deadlineMs,
} = {}) {
  const startedAt = new Date().toISOString();
  const runId = `run-${Date.now()}`;
  const deadline = Date.now() + (Number.isFinite(deadlineMs) ? deadlineMs : 20000);
  const existingProducts = await catalogProductRepo.listCatalogProducts();
  const brandOverrides = new Map(
    existingProducts
      .filter((product) => product.brand)
      .map((product) => [normalizeKey(product.model), product.brand])
      .filter(([key]) => key)
  );
  let filesScanned = 0;
  let filesProcessed = 0;
  let rowsParsed = 0;
  let productsAvailable = 0;
  let vendors = [];
  let vendorsDetected = 0;
  let discoveryError = null;
  const safeIssueCount = async () => {
    if (!issueRepo) return 0;
    try {
      const items = await issueRepo.listIssues();
      return items.length;
    } catch (_error) {
      return 0;
    }
  };
  try {
    vendors = await discoverVendors({ driveClient, vendorRepo });
    vendorsDetected = vendors.length;
  } catch (error) {
    discoveryError = error;
  }
  const run = {
    runId,
    startedAt,
    finishedAt: null,
    error: null,
    stats: {
      vendorsDetected,
      filesScanned: 0,
      filesProcessed: 0,
      rowsParsed: 0,
      productsAvailable: 0,
      issuesCount: 0,
    },
  };
  if (syncRunRepo) {
    await syncRunRepo.createRun(run);
  }

  try {
    if (discoveryError) {
      throw discoveryError;
    }
    for (const vendor of vendors) {
      if (Date.now() > deadline) break;
      let files = await discoverFiles({ driveClient, sourceFileRepo, vendorId: vendor.vendorId });
      if (Number.isFinite(maxFilesPerVendor)) {
        files = files.slice(0, Math.max(0, maxFilesPerVendor));
      }
      filesScanned += files.length;
      if (syncRunRepo) {
        await syncRunRepo.updateRun(runId, {
          stats: {
            vendorsDetected,
            filesScanned,
            filesProcessed,
            rowsParsed,
            productsAvailable,
            issuesCount: await safeIssueCount(),
          },
        });
      }
      for (const file of files) {
        if (Date.now() > deadline) break;
        const buffer = await driveClient.downloadFile({
          fileId: file.fileId,
          mimeType: file.mimeType,
        });
        if (!buffer) {
          continue;
        }
        await deleteSourcesByFile(file.fileId);
        await deleteRowsByFile(file.fileId);
        const parsed = await parseCatalogFile({
          fileId: file.fileId,
          vendorId: vendor.vendorId,
          fileName: file.fileName,
          buffer,
          mimeType: file.mimeType,
          sourceRowRepo,
          issueRepo,
          maxRows: maxRowsPerFile,
        });
        filesProcessed += 1;
        rowsParsed += parsed.rowsParsed;
        if (syncRunRepo) {
          await syncRunRepo.updateRun(runId, {
            stats: {
              vendorsDetected,
              filesScanned,
              filesProcessed,
              rowsParsed,
              productsAvailable,
              issuesCount: await safeIssueCount(),
            },
          });
        }

        const rows = await sourceRowRepo.listSourceRows({ fileId: file.fileId });
        const brandMap = buildBrandMap(rows);
        for (const row of rows) {
          if (Date.now() > deadline) break;
          const extraction = await enrichSourceRowWithModel({
            rawRow: row.rawRow,
            issueRepo,
            vendorId: vendor.vendorId,
            fileId: file.fileId,
            fileName: file.fileName,
            sourceRowId: row.sourceRowId,
          });
          const modelCandidate =
            extraction.status === 'extracted' ? extraction.model : inferModelFromRow(row.rawRow);
          if (!modelCandidate) continue;
          const stockValue =
            parseStockValue(row.rawRow?.stock ?? row.rawRow?.saldo ?? row.rawRow?.disponible) ?? null;
          if (stockValue !== null && stockValue <= 1) {
            continue;
          }
          const rowBrandValue =
            row.rawRow?.brand ||
            row.rawRow?.marca ||
            row.rawRow?.marca_producto ||
            row.rawRow?.brand_name ||
            row.rawRow?.marca_producto_nombre;
          const inferredBrand =
            (rowBrandValue ? normalizeTokens(rowBrandValue) : null) ||
            extraction.brand ||
            inferBrandFromText(
              `${row.rawRow?.description || ''} ${row.rawRow?.descripcion || ''} ${row.rawRow?.product || ''} ${
                row.rawRow?.producto || ''
              } ${row.rawRow?.model || ''} ${row.rawRow?.modelo || ''}`,
              brandMap
            );
          const modelKey = normalizeKey(modelCandidate) || row.sourceRowId;
          if (inferredBrand && modelKey) {
            brandOverrides.set(modelKey, inferredBrand);
          }
          const resolvedBrand = inferredBrand || (modelKey ? brandOverrides.get(modelKey) : null) || null;
          const productId = `prod-${modelKey}`;
          await catalogProductRepo.upsertCatalogProduct({
            id: productId,
            model: modelCandidate,
            brand: resolvedBrand,
            available: true,
            updatedAt: new Date().toISOString(),
          });
          await catalogSourceRepo.addCatalogSource({
            catalogProductId: productId,
            sourceRowId: row.sourceRowId,
            vendorId: vendor.vendorId,
            vendorName: vendor.name || null,
            fileId: file.fileId,
            fileName: file.fileName || null,
            sheetName: row.sheetName || null,
            rowNumber: row.rowNumber || null,
          });
        }
      }
    }

    const productsAvailableList = await catalogProductRepo.listCatalogProducts();
    if (brandOverrides.size > 0) {
      for (const product of productsAvailableList) {
        if (product.brand) continue;
        const key = normalizeKey(product.model);
        const override = key ? brandOverrides.get(key) : null;
        if (override) {
          await catalogProductRepo.upsertCatalogProduct({
            id: product.id,
            model: product.model,
            brand: override,
            available: product.available,
            updatedAt: new Date().toISOString(),
          });
          product.brand = override;
        }
      }
    }
    productsAvailable = productsAvailableList.length;
    const issuesCount = await safeIssueCount();

    const finishedRun = {
      runId,
      startedAt,
      finishedAt: new Date().toISOString(),
      error: null,
      stats: {
        vendorsDetected,
        filesScanned,
        filesProcessed,
        rowsParsed,
        productsAvailable,
        issuesCount,
      },
    };

    if (syncRunRepo) {
      await syncRunRepo.updateRun(runId, {
        stats: finishedRun.stats,
        finishedAt: finishedRun.finishedAt,
        error: null,
      });
    }
    try {
      await deleteOrphanProducts();
    } catch (error) {
      console.warn('[catalog] deleteOrphanProducts failed, continuing sync:', error?.message || error);
    }

    return finishedRun;
  } catch (error) {
    const errorMessage = (error?.message || String(error) || 'sync_failed').toString().slice(0, 5000);
    const issuesCount = await safeIssueCount();
    const failedRun = {
      runId,
      startedAt,
      finishedAt: new Date().toISOString(),
      error: errorMessage,
      stats: {
        vendorsDetected,
        filesScanned,
        filesProcessed,
        rowsParsed,
        productsAvailable,
        issuesCount,
      },
    };
    if (syncRunRepo) {
      await syncRunRepo.updateRun(runId, {
        stats: failedRun.stats,
        finishedAt: failedRun.finishedAt,
        error: failedRun.error,
      });
    }
    return failedRun;
  }
}

function listSyncRuns({ syncRunRepo } = {}) {
  return syncRunRepo ? syncRunRepo.listRuns() : [];
}

function listIssues({ issueRepo, runId } = {}) {
  return issueRepo ? issueRepo.listIssues({ runId }) : [];
}

module.exports = {
  runCatalogSync,
  listSyncRuns,
  listIssues,
};
