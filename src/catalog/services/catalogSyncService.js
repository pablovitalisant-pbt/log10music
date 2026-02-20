const { getCatalogState } = require('../state/catalogState');

function runCatalogSync({ syncRunRepo } = {}) {
  const state = getCatalogState();
  const resolvedRunId = `run-${Date.now()}`;
  const run = {
    runId: resolvedRunId,
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    stats: {
      vendorsDetected: 0,
      filesScanned: 0,
      filesProcessed: 0,
      rowsParsed: 0,
      productsAvailable: 0,
      issuesCount: 0,
    },
  };
  if (syncRunRepo) {
    syncRunRepo.createRun(run);
  }
  state.lastSyncAt = run.finishedAt;
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
