const { getCatalogState } = require('../state/catalogState');
const { discoverFiles, discoverVendors } = require('./driveDiscovery');
const { parseCatalogFile } = require('./fileParseService');
const { enrichSourceRowWithModel } = require('./modelEnrichmentService');

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

async function runCatalogSync({
  syncRunRepo,
  driveClient,
  vendorRepo,
  sourceFileRepo,
  sourceRowRepo,
  issueRepo,
  catalogProductRepo,
  catalogSourceRepo,
} = {}) {
  const state = getCatalogState();
  const startedAt = new Date().toISOString();
  const runId = `run-${Date.now()}`;
  const vendors = await discoverVendors({ driveClient, vendorRepo });
  let filesScanned = 0;
  let filesProcessed = 0;
  let rowsParsed = 0;
  let productsAvailable = 0;

  for (const vendor of vendors) {
    const files = await discoverFiles({ driveClient, sourceFileRepo, vendorId: vendor.vendorId });
    filesScanned += files.length;
    for (const file of files) {
      const buffer = await driveClient.downloadFile({
        fileId: file.fileId,
        mimeType: file.mimeType,
      });
      if (!buffer) {
        continue;
      }
      const parsed = parseCatalogFile({
        fileId: file.fileId,
        vendorId: vendor.vendorId,
        fileName: file.fileName,
        buffer,
        mimeType: file.mimeType,
        sourceRowRepo,
        issueRepo,
      });
      filesProcessed += 1;
      rowsParsed += parsed.rowsParsed;

      const rows = sourceRowRepo.listSourceRows().filter((row) => row.fileId === file.fileId);
      for (const row of rows) {
        const extraction = enrichSourceRowWithModel({
          rawRow: row.rawRow,
          issueRepo,
          vendorId: vendor.vendorId,
          fileId: file.fileId,
          fileName: file.fileName,
          sourceRowId: row.sourceRowId,
        });
        if (extraction.status === 'extracted' && extraction.model) {
          const productId = `prod-${slugify(extraction.model) || row.sourceRowId}`;
          catalogProductRepo.upsertCatalogProduct({
            id: productId,
            model: extraction.model,
            brand: extraction.brand || null,
            available: true,
            updatedAt: new Date().toISOString(),
          });
          catalogSourceRepo.addCatalogSource({
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
  }

  productsAvailable = catalogProductRepo.listCatalogProducts().length;
  const issuesCount = issueRepo.listIssues().length;

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
    syncRunRepo.createRun(run);
  }

  state.lastSyncAt = run.finishedAt;
  state.productsAvailable = productsAvailable;
  state.filesProcessedTotal += filesProcessed;
  state.rowsParsedTotal += rowsParsed;

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
