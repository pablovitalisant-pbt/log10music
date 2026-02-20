import { CatalogMetricsResponseSchema } from '../../../../docs/specs/catalog.metrics.contract.js';
import { listIssues, listProducts, listSyncRuns } from '../../../../src/catalog/persistence/catalogDb.js';

export async function GET(_request: Request) {
  const [runs, issues, products] = await Promise.all([
    listSyncRuns(),
    listIssues(),
    listProducts(),
  ]);
  const typedRuns = runs as Array<{ startedAt?: string; stats?: { filesProcessed?: number; rowsParsed?: number } }>;
  const typedIssues = issues as Array<{ type?: string }>;
  const windowHours = 24;
  const now = Date.now();
  const runsLast24h = typedRuns.filter((run) => {
    const startedAt = Date.parse(run.startedAt || '');
    if (Number.isNaN(startedAt)) return false;
    return startedAt >= now - windowHours * 60 * 60 * 1000;
  }).length;
  const metrics = {
    windowHours,
    runsTotal: typedRuns.length,
    runsLast24h,
    issuesTotal: typedIssues.length,
    issuesAmbiguous: typedIssues.filter((issue) => issue.type === 'ambiguous_model').length,
    filesProcessedTotal: typedRuns.reduce((sum, run) => sum + (run.stats?.filesProcessed || 0), 0),
    rowsParsedTotal: typedRuns.reduce((sum, run) => sum + (run.stats?.rowsParsed || 0), 0),
  };
  const payload = CatalogMetricsResponseSchema.parse(metrics);
  return Response.json(payload);
}
