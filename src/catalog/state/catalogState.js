const state = {
  runs: [],
  issues: [],
  vendors: [],
  files: [],
  rows: [],
  products: [],
  sources: [],
  lastSyncAt: null,
  productsAvailable: 0,
  filesProcessedTotal: 0,
  rowsParsedTotal: 0,
};

function getCatalogState() {
  return state;
}

module.exports = {
  getCatalogState,
};
