import { listProducts } from '../../../../src/catalog/persistence/catalogDb.js';

export async function GET(_request: Request) {
  const products = await listProducts();
  const typedProducts = products as Array<{ brand?: string | null }>;
  const brands = Array.from(
    new Set(
      typedProducts
        .map((product) => product.brand)
        .filter((brand): brand is string => Boolean(brand && brand.trim()))
    )
  ).sort((a, b) => a.localeCompare(b, 'es'));
  return Response.json({ items: brands });
}
