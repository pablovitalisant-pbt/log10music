function getCatalogHealth({ state, lastSyncAt, issuesOpen, productsAvailable } = {}) {
  const resolvedLastSyncAt = lastSyncAt ?? (state ? state.lastSyncAt : null);
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
    issuesOpen: Number.isFinite(issuesOpen)
      ? issuesOpen
      : state
        ? state.issues.filter((issue) => !issue.resolved).length
        : 0,
    productsAvailable: Number.isFinite(productsAvailable)
      ? productsAvailable
      : state
        ? state.productsAvailable || 0
        : 0,
    reasonCodes,
  };
}

module.exports = {
  getCatalogHealth,
};
