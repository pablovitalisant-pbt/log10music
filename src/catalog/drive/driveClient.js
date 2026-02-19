function createDriveClient({ vendors, files } = {}) {
  return {
    listVendors() {
      return vendors ? [...vendors] : [];
    },
    listFiles(vendorId) {
      if (!vendorId) return [];
      return files ? files.filter((file) => file.vendorId === vendorId) : [];
    },
  };
}

module.exports = {
  createDriveClient,
};
