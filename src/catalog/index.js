const {
  createCatalogStore,
  addVendor,
  listVendors,
  addCatalogProduct,
  listCatalogProducts,
} = require('./catalogStore');
const { createDriveClient } = require('./drive/driveClient');
const { createVendorRepo } = require('./repositories/vendorRepo');
const { createSourceFileRepo } = require('./repositories/sourceFileRepo');
const { discoverVendors, discoverFiles } = require('./services/driveDiscovery');

module.exports = {
  createCatalogStore,
  addVendor,
  listVendors,
  addCatalogProduct,
  listCatalogProducts,
  createDriveClient,
  createVendorRepo,
  createSourceFileRepo,
  discoverVendors,
  discoverFiles,
};
