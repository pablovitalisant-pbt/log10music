const { getCatalogState } = require('../state/catalogState');

function createCatalogSourceRepo({ store } = {}) {
  const state = store || getCatalogState();
  return {
    addCatalogSource(source) {
      state.sources.push(source);
      return source;
    },
    listCatalogSources({ catalogProductId } = {}) {
      if (!catalogProductId) return [...state.sources];
      return state.sources.filter((source) => source.catalogProductId === catalogProductId);
    },
  };
}

module.exports = {
  createCatalogSourceRepo,
};
