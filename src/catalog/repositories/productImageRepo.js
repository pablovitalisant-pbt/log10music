const {
  getApprovedProductImageOverride,
  upsertProductImageOverride,
  deleteProductImageOverride,
} = require('../persistence/catalogDb');

function createProductImageRepo({ store } = {}) {
  return {
    async getApprovedOverride(productId) {
      return store ? store.getApprovedOverride(productId) : getApprovedProductImageOverride(productId);
    },
    async upsertOverride(payload) {
      return store ? store.upsertOverride(payload) : upsertProductImageOverride(payload);
    },
    async deleteOverride(productId) {
      return store ? store.deleteOverride(productId) : deleteProductImageOverride(productId);
    },
  };
}

module.exports = {
  createProductImageRepo,
};
