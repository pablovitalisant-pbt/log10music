(() => {
  const { GET: getCatalogProducts } = require('../../app/api/catalog/products/route.ts');
  const { CatalogProductsResponseSchema } = require('../../docs/specs/catalog.aggregate.contract.js');

  describe('slice-S13 catalog UI images', () => {
    it('catalog products response includes image fields', async () => {
      const response = await getCatalogProducts(new Request('http://localhost/api/catalog/products'));
      expect(response.status).toBe(200);
      const payload = await response.json();
      CatalogProductsResponseSchema.parse(payload);
      if (payload.items.length > 0) {
        const item = payload.items[0];
        expect('imageUrl' in item).toBe(true);
        expect('imageSource' in item).toBe(true);
        expect('imageUpdatedAt' in item).toBe(true);
      }
    });
  });
})();
