const { upsertProduct, listProducts, getProductById } = require('../persistence/catalogDb');

function createCatalogProductRepo({ store } = {}) {
  return {
    async upsertCatalogProduct(product) {
      return store ? store.upsertCatalogProduct(product) : upsertProduct(product);
    },
    async listCatalogProducts() {
      return store ? store.listCatalogProducts() : listProducts();
    },
    async getCatalogProductById(id) {
      return store ? store.getCatalogProductById(id) : getProductById(id);
    },
  };
}

module.exports = {
  createCatalogProductRepo,
};
