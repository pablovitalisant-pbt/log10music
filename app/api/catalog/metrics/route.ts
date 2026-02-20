import { CatalogMetricsResponseSchema } from '../../../../docs/specs/catalog.metrics.contract.js';
import { getCatalogMetrics } from '../../../../src/catalog/services/catalogMetricsService.js';
import { getCatalogState } from '../../../../src/catalog/state/catalogState.js';

export async function GET(_request: Request) {
  const metrics = getCatalogMetrics({ state: getCatalogState() });
  const payload = CatalogMetricsResponseSchema.parse(metrics);
  return Response.json(payload);
}
