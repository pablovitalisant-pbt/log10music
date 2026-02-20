export {};

const {
  CatalogImageResponseSchema: ImagesResponseSchema,
} = require('../../docs/specs/catalog.images.contract.js');
const { GET: getImages } = require('../../app/api/catalog/images/route.ts');

describe('slice-S12 catalog images fallback', () => {
  it('falls back to LogoKit when MercadoLibre has no results', async () => {
    const originalFetch = global.fetch;
    process.env.LOGOKIT_PUBLISHABLE_TOKEN = 'pk_test';
    global.fetch = (async (url: unknown) => {
      if (String(url).includes('api.mercadolibre.com')) {
        return {
          ok: true,
          json: async () => ({ results: [] }),
        };
      }
      if (String(url).includes('img.logokit.com')) {
        return {
          ok: true,
          json: async () => ({}),
        };
      }
      return { ok: false, json: async () => ({}) };
    }) as typeof fetch;

    const response = await getImages(
      new Request('http://localhost/api/catalog/images?query=AKG%20C414&limit=1')
    );
    expect(response.status).toBe(200);
    const payload = await response.json();
    ImagesResponseSchema.parse(payload);
    expect(payload.items.length).toBe(1);
    expect(payload.items[0].source).toBe('logokit');
    global.fetch = originalFetch;
  });
});
