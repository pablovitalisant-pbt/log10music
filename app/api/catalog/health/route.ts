import { CatalogHealthResponseSchema } from '../../../../docs/specs/catalog.health.contract.js';
import { getCatalogHealth } from '../../../../src/catalog/services/catalogHealthService.js';
import {
  getLatestSyncRun,
  listIssues,
  listProducts,
} from '../../../../src/catalog/persistence/catalogDb.js';

export async function GET(_request: Request) {
  const latestRun = await getLatestSyncRun();
  const issues = (await listIssues()) as Array<{ resolved?: boolean }>;
  const products = await listProducts();
  const health = getCatalogHealth({
    lastSyncAt: latestRun ? latestRun.finishedAt : null,
    issuesOpen: issues.filter((issue) => !issue.resolved).length,
    productsAvailable: products.filter((product) => product.available).length,
  });
  const payload = CatalogHealthResponseSchema.parse(health);
  return Response.json(payload);
}
