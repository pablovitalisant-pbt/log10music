const { aggregateCatalog } = require('../aggregate/catalogAggregator');

function buildCatalogAggregate({
  catalogProductRepo,
  catalogSourceRepo,
  updatedAt,
} = {}) {
  const products = catalogProductRepo ? catalogProductRepo.listCatalogProducts() : [];
  const sources = catalogSourceRepo ? catalogSourceRepo.listCatalogSources() : [];
  return aggregateCatalog({
    products,
    sources,
    updatedAt: updatedAt || new Date().toISOString(),
  });
}

module.exports = {
  buildCatalogAggregate,
};
