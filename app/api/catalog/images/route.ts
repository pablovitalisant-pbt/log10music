import {
  CatalogImageBadRequestSchema,
  CatalogImageResponseSchema,
} from '../../../../docs/specs/catalog.images.contract.js';
import { searchCatalogImages } from '../../../../src/catalog/services/catalogImageService.js';
import { createCatalogProductRepo } from '../../../../src/catalog/repositories/catalogProductRepo.js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : undefined;
  if (!query.trim()) {
    const payload = CatalogImageBadRequestSchema.parse({ error: 'query is required' });
    return Response.json(payload, { status: 400 });
  }
  const catalogProductRepo = createCatalogProductRepo();
  const items = await searchCatalogImages({ query, limit, catalogProductRepo });
  const payload = CatalogImageResponseSchema.parse({ query, items });
  return Response.json(payload);
}
