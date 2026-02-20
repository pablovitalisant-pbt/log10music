function getCatalogMetrics({ state, windowHours = 24 } = {}) {
  const now = Date.now();
  const runs = state ? state.runs : [];
  const issues = state ? state.issues : [];
  const runsTotal = runs.length;
  const runsLast24h = runs.filter((run) => {
    const startedAt = Date.parse(run.startedAt || '');
    if (Number.isNaN(startedAt)) return false;
    return startedAt >= now - windowHours * 60 * 60 * 1000;
  }).length;
  const issuesTotal = issues.length;
  const issuesAmbiguous = issues.filter((issue) => issue.type === 'ambiguous_model').length;
  return {
    windowHours,
    runsTotal,
    runsLast24h,
    issuesTotal,
    issuesAmbiguous,
    filesProcessedTotal: state ? state.filesProcessedTotal || 0 : 0,
    rowsParsedTotal: state ? state.rowsParsedTotal || 0 : 0,
  };
}

module.exports = {
  getCatalogMetrics,
};
