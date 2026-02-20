const { getCatalogState } = require('../state/catalogState');

function createVendorRepo({ store } = {}) {
  const state = store || getCatalogState();
  return {
    upsertVendor(vendor) {
      const index = state.vendors.findIndex((item) => item.vendorId === vendor.vendorId);
      if (index >= 0) {
        state.vendors[index] = vendor;
        return vendor;
      }
      state.vendors.push(vendor);
      return vendor;
    },
    listVendors() {
      return [...state.vendors];
    },
  };
}

module.exports = {
  createVendorRepo,
};
