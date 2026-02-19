function discoverVendors({ driveClient, vendorRepo } = {}) {
  const vendors = driveClient ? driveClient.listVendors() : [];
  const persisted = vendors.map((vendor) => vendorRepo.upsertVendor(vendor));
  return persisted;
}

function discoverFiles({ driveClient, sourceFileRepo, vendorId } = {}) {
  const files = driveClient ? driveClient.listFiles(vendorId) : [];
  const persisted = files.map((file) => sourceFileRepo.upsertSourceFile(file));
  return persisted;
}

module.exports = {
  discoverVendors,
  discoverFiles,
};
