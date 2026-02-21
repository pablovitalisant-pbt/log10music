const {
  getApprovedProductImageOverride,
  upsertProductImageOverride,
} = require('../persistence/catalogDb');

function createProductImageRepo({ store } = {}) {
  return {
    async getApprovedOverride(productId) {
      return store ? store.getApprovedOverride(productId) : getApprovedProductImageOverride(productId);
    },
    async upsertOverride(payload) {
      return store ? store.upsertOverride(payload) : upsertProductImageOverride(payload);
    },
  };
}

module.exports = {
  createProductImageRepo,
};
