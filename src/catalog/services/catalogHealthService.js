function getCatalogHealth({ lastSyncAt, issuesOpen, productsAvailable } = {}) {
  const resolvedLastSyncAt = lastSyncAt ?? null;
  const hasLastSync = Boolean(resolvedLastSyncAt);
  const staleMinutes = hasLastSync ? 0 : null;
  const reasonCodes = [];
  if (!hasLastSync) {
    reasonCodes.push('no_sync_yet');
  }
  const status = reasonCodes.length ? 'degraded' : 'ok';
  return {
    status,
    lastSyncAt: hasLastSync ? resolvedLastSyncAt : null,
    staleMinutes,
    issuesOpen: Number.isFinite(issuesOpen) ? issuesOpen : 0,
    productsAvailable: Number.isFinite(productsAvailable) ? productsAvailable : 0,
    reasonCodes,
  };
}

module.exports = {
  getCatalogHealth,
};
