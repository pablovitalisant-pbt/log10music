import { CatalogHealthResponseSchema } from '../../../../docs/specs/catalog.health.contract.js';
import { getCatalogHealth } from '../../../../src/catalog/services/catalogHealthService.js';
import { getLatestSyncRun, listIssues, listProducts } from '../../../../src/catalog/persistence/catalogDb.js';

export async function GET(_request: Request) {
  const latestRun = await getLatestSyncRun();
  const issues = (await listIssues()) as Array<{ resolved?: boolean }>;
  const products = (await listProducts()) as Array<{ available?: boolean; updatedAt?: string }>;
  const fallbackLastSyncAt = products.reduce((latest: string | null, product) => {
    if (!product.updatedAt) return latest;
    if (!latest) return product.updatedAt;
    return Date.parse(product.updatedAt) > Date.parse(latest) ? product.updatedAt : latest;
  }, null);
  const health = getCatalogHealth({
    lastSyncAt: latestRun ? latestRun.finishedAt : fallbackLastSyncAt,
    issuesOpen: issues.filter((issue) => !issue.resolved).length,
    productsAvailable: products.filter((product) => product.available).length,
  });
  const payload = CatalogHealthResponseSchema.parse(health);
  return Response.json(payload);
}
