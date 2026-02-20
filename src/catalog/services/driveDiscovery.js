async function discoverVendors({ driveClient, vendorRepo } = {}) {
  const vendors = driveClient ? await driveClient.listVendors() : [];
  const persisted = vendors.map((vendor) => vendorRepo.upsertVendor(vendor));
  return persisted;
}

async function discoverFiles({ driveClient, sourceFileRepo, vendorId } = {}) {
  const files = driveClient ? await driveClient.listFiles(vendorId) : [];
  const persisted = files.map((file) => sourceFileRepo.upsertSourceFile(file));
  return persisted;
}

module.exports = {
  discoverVendors,
  discoverFiles,
};
