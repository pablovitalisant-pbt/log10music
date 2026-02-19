const { VendorSchema, CatalogProductSchema } = require('../../docs/specs/catalog.foundation.contract');

function createCatalogStore() {
  return {
    vendors: [],
    products: [],
  };
}

function addVendor(store, vendor) {
  VendorSchema.parse(vendor);
  const index = store.vendors.findIndex((item) => item.vendorId === vendor.vendorId);
  if (index >= 0) {
    store.vendors[index] = vendor;
    return vendor;
  }
  store.vendors.push(vendor);
  return vendor;
}

function listVendors(store) {
  return store.vendors;
}

function addCatalogProduct(store, product) {
  CatalogProductSchema.parse(product);
  const index = store.products.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    store.products[index] = product;
    return product;
  }
  store.products.push(product);
  return product;
}

function listCatalogProducts(store) {
  return store.products;
}

module.exports = {
  createCatalogStore,
  addVendor,
  listVendors,
  addCatalogProduct,
  listCatalogProducts,
};
