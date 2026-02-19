import { CatalogHealthResponseSchema } from '../../../../docs/specs/catalog.health.contract.js';
import { getCatalogHealth } from '../../../../src/catalog/services/catalogHealthService.js';

export async function GET(_request: Request) {
  const health = getCatalogHealth({
    lastSyncAt: null,
    issuesOpen: 0,
    productsAvailable: 0,
  });
  const payload = CatalogHealthResponseSchema.parse(health);
  return Response.json(payload);
}
