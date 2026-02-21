(() => {
  const { CatalogPublicPageModelSchema } = require('../../docs/specs/catalog.public-page.contract.js');
  const { hydrateCatalogImages } = require('../../src/catalog/publicCatalogImages.js');

  describe('slice-S14 catalog UI image fetch', () => {
    it('hydrates imageUrl when missing via api/catalog/images', async () => {
      const originalFetch = global.fetch;
      global.fetch = (async (url) => {
        const urlText = String(url);
        if (urlText.includes('/api/catalog/public')) {
          return {
            ok: true,
            json: async () => ({
              updatedAt: new Date().toISOString(),
              items: [
                {
                  id: 'prod-1',
                  model: 'AKG C414',
                  brand: 'AKG',
                  available: true,
                  imageUrl: null,
                  imageSource: null,
                  imageUpdatedAt: null,
                },
              ],
            }),
          };
        }
        if (urlText.includes('/api/catalog/images')) {
          return {
            ok: true,
            json: async () => ({
              query: 'AKG C414',
              items: [
                {
                  url: 'https://img.logokit.com/akg.com?token=pk_test',
                  source: 'logokit',
                  updatedAt: new Date().toISOString(),
                },
              ],
            }),
          };
        }
        return { ok: false, json: async () => ({}) };
      }) as typeof fetch;

      const payload = await hydrateCatalogImages({ baseUrl: 'http://localhost' });
      CatalogPublicPageModelSchema.parse(payload);
      expect(payload.items[0].imageUrl).toBe('https://img.logokit.com/akg.com?token=pk_test');
      global.fetch = originalFetch;
    });
  });
})();
