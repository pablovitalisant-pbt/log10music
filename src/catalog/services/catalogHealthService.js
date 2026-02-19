function getCatalogHealth({ lastSyncAt, issuesOpen, productsAvailable } = {}) {
  const hasLastSync = Boolean(lastSyncAt);
  const staleMinutes = hasLastSync ? 0 : null;
  const reasonCodes = [];
  if (!hasLastSync) {
    reasonCodes.push('no_sync_yet');
  }
  const status = reasonCodes.length ? 'degraded' : 'ok';
  return {
    status,
    lastSyncAt: hasLastSync ? lastSyncAt : null,
    staleMinutes,
    issuesOpen: Number.isFinite(issuesOpen) ? issuesOpen : 0,
    productsAvailable: Number.isFinite(productsAvailable) ? productsAvailable : 0,
    reasonCodes,
  };
}

module.exports = {
  getCatalogHealth,
};
