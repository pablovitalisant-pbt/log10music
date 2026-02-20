import { CatalogMetricsResponseSchema } from '../../../../docs/specs/catalog.metrics.contract.js';
import { getCatalogMetrics } from '../../../../src/catalog/services/catalogMetricsService.js';

export async function GET(_request: Request) {
  const metrics = getCatalogMetrics();
  const payload = CatalogMetricsResponseSchema.parse(metrics);
  return Response.json(payload);
}
