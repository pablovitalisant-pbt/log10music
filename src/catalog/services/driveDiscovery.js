async function discoverVendors({ driveClient, vendorRepo } = {}) {
  const vendors = driveClient ? await driveClient.listVendors() : [];
  vendors.sort((a, b) => {
    const nameCompare = (a.name || '').localeCompare(b.name || '', 'es');
    if (nameCompare !== 0) return nameCompare;
    return (a.vendorId || '').localeCompare(b.vendorId || '', 'es');
  });
  const persisted = [];
  for (const vendor of vendors) {
    persisted.push(await vendorRepo.upsertVendor(vendor));
  }
  return persisted;
}

async function discoverFiles({ driveClient, sourceFileRepo, vendorId } = {}) {
  const files = driveClient ? await driveClient.listFiles(vendorId) : [];
  files.sort((a, b) => {
    const timeCompare = (b.modifiedTime || '').localeCompare(a.modifiedTime || '');
    if (timeCompare !== 0) return timeCompare;
    const nameCompare = (a.fileName || '').localeCompare(b.fileName || '', 'es');
    if (nameCompare !== 0) return nameCompare;
    return (a.fileId || '').localeCompare(b.fileId || '', 'es');
  });
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
