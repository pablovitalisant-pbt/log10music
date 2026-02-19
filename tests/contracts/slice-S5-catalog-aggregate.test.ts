const {
  PublicCatalogResponseSchema,
  CatalogProductsResponseSchema,
  CatalogProductAdminSchema,
  CatalogNotFoundSchema,
} = require('../../docs/specs/catalog.aggregate.contract');

const { GET: getPublic } = require('../../app/api/catalog/public/route');
const { GET: getProducts } = require('../../app/api/catalog/products/route');
const { GET: getProductById } = require('../../app/api/catalog/products/[id]/route');

function assertNoPriceOrStock(item: any) {
  expect(item.price).toBe(undefined);
  expect(item.stock).toBe(undefined);
}

describe('slice-S5: catalog aggregate', () => {
  it('GET /api/catalog/public filtra disponibles y sin precio/stock', async () => {
    const response = await getPublic(new Request('http://localhost/api/catalog/public'));
    const payload = await response.json();
    const parsed = PublicCatalogResponseSchema.parse(payload);
    expect(parsed.items.length >= 0).toBe(true);
    parsed.items.forEach((item: any) => {
      expect(item.available).toBe(true);
      assertNoPriceOrStock(item);
    });
  });

  it('GET /api/catalog/products no incluye precio/stock', async () => {
    const response = await getProducts(new Request('http://localhost/api/catalog/products'));
    const payload = await response.json();
    const parsed = CatalogProductsResponseSchema.parse(payload);
    parsed.items.forEach((item: any) => {
      assertNoPriceOrStock(item);
      item.sourcesAvailable.forEach((source: any) => {
        assertNoPriceOrStock(source);
      });
    });
  });

  it('GET /api/catalog/products/{id} valida existente y 404', async () => {
    const okResponse = await getProductById(
      new Request('http://localhost/api/catalog/products/product-1'),
      { params: { id: 'product-1' } }
    );
    expect(okResponse.status).toBe(200);
    const okPayload = await okResponse.json();
    const parsedOk = CatalogProductAdminSchema.parse(okPayload);
    expect(parsedOk.id).toBe('product-1');

    const notFoundResponse = await getProductById(
      new Request('http://localhost/api/catalog/products/unknown'),
      { params: { id: 'unknown' } }
    );
    expect(notFoundResponse.status).toBe(404);
    const notFoundPayload = await notFoundResponse.json();
    const parsedNotFound = CatalogNotFoundSchema.parse(notFoundPayload);
    expect(parsedNotFound.error).toBe(parsedNotFound.error);
  });
});
