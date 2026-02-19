function getCatalogMetrics({
  windowHours = 24,
  runsTotal = 0,
  runsLast24h = 0,
  issuesTotal = 0,
  issuesAmbiguous = 0,
  filesProcessedTotal = 0,
  rowsParsedTotal = 0,
} = {}) {
  return {
    windowHours,
    runsTotal,
    runsLast24h,
    issuesTotal,
    issuesAmbiguous,
    filesProcessedTotal,
    rowsParsedTotal,
  };
}

module.exports = {
  getCatalogMetrics,
};
