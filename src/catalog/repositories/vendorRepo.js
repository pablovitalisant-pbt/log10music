const { upsertVendor, listVendors } = require('../persistence/catalogDb');

function createVendorRepo({ store } = {}) {
  return {
    async upsertVendor(vendor) {
      return store ? store.upsertVendor(vendor) : upsertVendor(vendor);
    },
    async listVendors() {
      return store ? store.listVendors() : listVendors();
    },
  };
}

module.exports = {
  createVendorRepo,
};
