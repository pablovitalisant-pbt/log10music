const { aggregateCatalog } = require('../aggregate/catalogAggregator');

async function buildCatalogAggregate({
  catalogProductRepo,
  catalogSourceRepo,
  updatedAt,
} = {}) {
  const products = catalogProductRepo ? await catalogProductRepo.listCatalogProducts() : [];
  const sources = catalogSourceRepo ? await catalogSourceRepo.listCatalogSources() : [];
  return aggregateCatalog({
    products,
    sources,
    updatedAt: updatedAt || new Date().toISOString(),
  });
}

module.exports = {
  buildCatalogAggregate,
};
