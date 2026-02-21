import {
  CatalogImageBadRequestSchema,
  CatalogImageResponseSchema,
} from '../../../../docs/specs/catalog.images.contract.js';
import { searchCatalogImages } from '../../../../src/catalog/services/catalogImageService.js';
import { createCatalogProductRepo } from '../../../../src/catalog/repositories/catalogProductRepo.js';
import { getIntegration } from '../../../../src/catalog/persistence/catalogDb.js';

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
  let accessToken = '';
  try {
    const integration = await getIntegration('mercadolibre');
    const data = integration?.data || {};
    if (data.access_token) {
      const expiresAt = Number(data.expires_at || 0);
      if (!expiresAt || Date.now() < expiresAt) {
        accessToken = data.access_token;
      }
    }
  } catch (_error) {
    accessToken = '';
  }
  const items = await searchCatalogImages({ query, limit, catalogProductRepo, accessToken });
  const payload = CatalogImageResponseSchema.parse({ query, items });
  return Response.json(payload);
}
