const { discoverFiles, discoverVendors } = require('./driveDiscovery');
const { parseCatalogFile } = require('./fileParseService');
const { enrichSourceRowWithModel } = require('./modelEnrichmentService');
const { parseStockValue } = require('../parse/stockInferer');

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
  const vendors = await discoverVendors({ driveClient, vendorRepo });
  let filesScanned = 0;
  let filesProcessed = 0;
  let rowsParsed = 0;
  let productsAvailable = 0;

  for (const vendor of vendors) {
    if (Date.now() > deadline) break;
    let files = await discoverFiles({ driveClient, sourceFileRepo, vendorId: vendor.vendorId });
    if (Number.isFinite(maxFilesPerVendor)) {
      files = files.slice(0, Math.max(0, maxFilesPerVendor));
    }
    filesScanned += files.length;
    for (const file of files) {
      if (Date.now() > deadline) break;
      const buffer = await driveClient.downloadFile({
        fileId: file.fileId,
        mimeType: file.mimeType,
      });
      if (!buffer) {
        continue;
      }
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

      const rows = await sourceRowRepo.listSourceRows({ fileId: file.fileId });
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
        if (extraction.status !== 'extracted' || !extraction.model) continue;
        const stockValue =
          parseStockValue(row.rawRow?.stock ?? row.rawRow?.saldo ?? row.rawRow?.disponible) ?? null;
        if (stockValue !== null && stockValue <= 1) {
          continue;
        }
        const brandKey = normalizeKey(extraction.brand || '');
        const modelKey = normalizeKey(extraction.model) || row.sourceRowId;
        const productId = `prod-${brandKey ? `${brandKey}-` : ''}${modelKey}`;
        await catalogProductRepo.upsertCatalogProduct({
          id: productId,
          model: extraction.model,
          brand: extraction.brand || null,
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
  productsAvailable = productsAvailableList.length;
  const issuesCount = await issueRepo.listIssues().then((items) => items.length);

  const run = {
    runId,
    startedAt,
    finishedAt: new Date().toISOString(),
    stats: {
      vendorsDetected: vendors.length,
      filesScanned,
      filesProcessed,
      rowsParsed,
      productsAvailable,
      issuesCount,
    },
  };

  if (syncRunRepo) {
    await syncRunRepo.createRun(run);
  }

  return run;
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
