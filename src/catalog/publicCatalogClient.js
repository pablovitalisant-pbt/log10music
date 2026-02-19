const { CatalogPublicPageModelSchema } = require('../../docs/specs/catalog.public-page.contract.js');

async function fetchPublicCatalog({ baseUrl } = {}) {
  if (baseUrl && typeof fetch === 'function') {
    const response = await fetch(`${baseUrl}/api/catalog/public`, { cache: 'no-store' });
    const payload = await response.json();
    return CatalogPublicPageModelSchema.parse(payload);
  }

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
