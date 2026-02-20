const { getCatalogState } = require('../state/catalogState');

function createCatalogProductRepo({ store } = {}) {
  const state = store || getCatalogState();
  return {
    upsertCatalogProduct(product) {
      const index = state.products.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        state.products[index] = product;
        return product;
      }
      state.products.push(product);
      return product;
    },
    listCatalogProducts() {
      return [...state.products];
    },
    getCatalogProductById(id) {
      return state.products.find((item) => item.id === id) || null;
    },
  };
}

module.exports = {
  createCatalogProductRepo,
};
