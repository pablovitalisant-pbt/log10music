const {
  CatalogImageResponseSchema,
  CatalogImageBadRequestSchema,
} = require('../../docs/specs/catalog.images.contract.js');
const { GET: getImages } = require('../../app/api/catalog/images/route.ts');

describe('slice-S11 catalog images', () => {
  it('returns 400 when query is missing', async () => {
    const response = await getImages(new Request('http://localhost/api/catalog/images'));
    expect(response.status).toBe(400);
    const payload = await response.json();
    CatalogImageBadRequestSchema.parse(payload);
  });

  it('returns images for a query', async () => {
    const response = await getImages(
      new Request('http://localhost/api/catalog/images?query=AKG%20C414&limit=2')
    );
    expect(response.status).toBe(200);
    const payload = await response.json();
    CatalogImageResponseSchema.parse(payload);
    expect(payload.items.length).toBe(2);
  });
});
