(() => {
  const { searchCatalogImages } = require('../../src/catalog/services/catalogImageService.js');

  describe('slice-S15 catalog images hi-res', () => {
    it('uses MercadoLibre item pictures for hi-res', async () => {
      const originalFetch = global.fetch;
      global.fetch = (async (url) => {
        const urlText = String(url);
        if (urlText.includes('/sites/')) {
          return {
            ok: true,
            json: async () => ({
              results: [{ id: 'MLC123' }],
            }),
          };
        }
        if (urlText.includes('/items/MLC123')) {
          return {
            ok: true,
            json: async () => ({
              pictures: [{ url: 'https://images.ml.com/hires.jpg' }],
            }),
          };
        }
        return { ok: false, json: async () => ({}) };
      }) as typeof fetch;

      const items = await searchCatalogImages({ query: 'AKG C414', limit: 1 });
      expect(items.length).toBe(1);
      expect(items[0].url).toBe('https://images.ml.com/hires.jpg');
      expect(items[0].source).toBe('ml');
      global.fetch = originalFetch;
    });
  });
})();
