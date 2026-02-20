import { CatalogHealthResponseSchema } from '../../../../docs/specs/catalog.health.contract.js';
import { getCatalogHealth } from '../../../../src/catalog/services/catalogHealthService.js';
import { getCatalogState } from '../../../../src/catalog/state/catalogState.js';

export async function GET(_request: Request) {
  const health = getCatalogHealth({ state: getCatalogState() });
  const payload = CatalogHealthResponseSchema.parse(health);
  return Response.json(payload);
}
