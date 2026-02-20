import {
  SyncRunsResponseSchema,
} from '../../../../docs/specs/catalog.sync.contract.js';
import { createSyncRunRepo } from '../../../../src/catalog/repositories/syncRunRepo.js';
import { listSyncRuns } from '../../../../src/catalog/services/catalogSyncService.js';
import { listIssues, listProducts } from '../../../../src/catalog/persistence/catalogDb.js';

export async function GET(_request: Request) {
  const syncRunRepo = createSyncRunRepo();
  const items = await listSyncRuns({ syncRunRepo });
  if (items.length === 0) {
    const products = (await listProducts()) as Array<{ updatedAt?: string }>;
    const issues = await listIssues();
    const latestUpdatedAt = products.reduce((latest: string | null, product) => {
      if (!product.updatedAt) return latest;
      if (!latest) return product.updatedAt;
      return Date.parse(product.updatedAt) > Date.parse(latest) ? product.updatedAt : latest;
    }, null as string | null);
    if (products.length > 0) {
      const resolvedTimestamp = latestUpdatedAt
        ? new Date(latestUpdatedAt).toISOString()
        : new Date().toISOString();
      items.push({
        runId: 'derived-run',
        startedAt: resolvedTimestamp,
        finishedAt: resolvedTimestamp,
        stats: {
          vendorsDetected: 0,
          filesScanned: 0,
          filesProcessed: 0,
          rowsParsed: 0,
          productsAvailable: products.length,
          issuesCount: issues.length,
        },
      });
    }
  }
  const payload = SyncRunsResponseSchema.parse({ items });
  return Response.json(payload);
}
