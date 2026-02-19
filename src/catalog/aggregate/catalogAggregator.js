function aggregateCatalog({ products, sources, updatedAt }) {
  const productMap = new Map();
  (products || []).forEach((product) => {
    productMap.set(product.id, {
      ...product,
      sourcesAvailable: [],
    });
  });
  (sources || []).forEach((source) => {
    const product = productMap.get(source.catalogProductId);
    if (product) {
      product.sourcesAvailable.push({
        vendorId: source.vendorId,
        vendorName: source.vendorName ?? null,
        fileId: source.fileId,
        fileName: source.fileName ?? null,
        sheetName: source.sheetName ?? null,
        rowNumber: source.rowNumber ?? null,
      });
    }
  });
  const items = Array.from(productMap.values());
  return {
    items,
    updatedAt,
  };
}

module.exports = {
  aggregateCatalog,
};
