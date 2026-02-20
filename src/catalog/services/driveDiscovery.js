async function discoverVendors({ driveClient, vendorRepo } = {}) {
  const vendors = driveClient ? await driveClient.listVendors() : [];
  const persisted = [];
  for (const vendor of vendors) {
    persisted.push(await vendorRepo.upsertVendor(vendor));
  }
  return persisted;
}

async function discoverFiles({ driveClient, sourceFileRepo, vendorId } = {}) {
  const files = driveClient ? await driveClient.listFiles(vendorId) : [];
  const persisted = [];
  for (const file of files) {
    persisted.push(await sourceFileRepo.upsertSourceFile(file));
  }
  return persisted;
}

module.exports = {
  discoverVendors,
  discoverFiles,
};
