const {
  CatalogPublicPageModelSchema,
} = require('../../docs/specs/catalog.public-page.contract');

const { fetchPublicCatalog } = require('../../src/catalog/publicCatalogClient');

describe('slice-S9: public catalog page', () => {
  it('modelo publico valida y sin precio/stock', async () => {
    const payload = await fetchPublicCatalog();
    const parsed = CatalogPublicPageModelSchema.parse(payload);
    parsed.items.forEach((item: any) => {
      expect(item.available).toBe(true);
      expect(item.price).toBe(undefined);
      expect(item.stock).toBe(undefined);
    });
  });
});
