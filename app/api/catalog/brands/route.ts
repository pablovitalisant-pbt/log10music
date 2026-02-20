import { listProducts } from '../../../../src/catalog/persistence/catalogDb.js';

export async function GET(_request: Request) {
  const products = await listProducts();
  const brands = Array.from(
    new Set(
      products
        .map((product) => product.brand)
        .filter((brand): brand is string => Boolean(brand && brand.trim()))
    )
  ).sort((a, b) => a.localeCompare(b, 'es'));
  return Response.json({ items: brands });
}
