const { addSource, listSources } = require('../persistence/catalogDb');

function createCatalogSourceRepo({ store } = {}) {
  return {
    async addCatalogSource(source) {
      return store ? store.addCatalogSource(source) : addSource(source);
    },
    async listCatalogSources({ catalogProductId } = {}) {
      return store ? store.listCatalogSources({ catalogProductId }) : listSources({ catalogProductId });
    },
  };
}

module.exports = {
  createCatalogSourceRepo,
};
