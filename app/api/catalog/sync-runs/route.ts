import {
  SyncRunsResponseSchema,
} from '../../../../docs/specs/catalog.sync.contract.js';
import { createSyncRunRepo } from '../../../../src/catalog/repositories/syncRunRepo.js';
import { listSyncRuns } from '../../../../src/catalog/services/catalogSyncService.js';
import { listIssues, listProducts } from '../../../../src/catalog/persistence/catalogDb.js';

export async function GET(_request: Request) {
  const syncRunRepo = createSyncRunRepo();
  const items = (await listSyncRuns({ syncRunRepo })) as Array<{
    runId: string;
    startedAt: string;
    finishedAt: string | null;
    error?: string | null;
    stats: {
      vendorsDetected: number;
      filesScanned: number;
      filesProcessed: number;
      rowsParsed: number;
      productsAvailable: number;
      issuesCount: number;
    };
  }>;
  const toIso = (value: string | null | undefined) => {
    if (!value) return new Date().toISOString();
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return new Date().toISOString();
    }
    return parsed.toISOString();
  };
  const normalizedItems = items.map((item) => ({
    ...item,
    startedAt: toIso(item.startedAt),
    finishedAt: item.finishedAt ? toIso(item.finishedAt) : null,
  }));
  if (normalizedItems.length === 0) {
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
      normalizedItems.push({
        runId: 'derived-run',
        startedAt: resolvedTimestamp,
        finishedAt: resolvedTimestamp,
        error: null,
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
  const payload = SyncRunsResponseSchema.parse({ items: normalizedItems });
  return Response.json(payload);
}
