const { CatalogPublicPageModelSchema } = require('../../docs/specs/catalog.public-page.contract.js');

async function fetchPublicCatalog() {
  const payload = {
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'product-1',
        model: 'Yamaha HS5',
        brand: 'Yamaha',
        available: true,
      },
    ],
  };
  return CatalogPublicPageModelSchema.parse(payload);
}

module.exports = {
  fetchPublicCatalog,
};
