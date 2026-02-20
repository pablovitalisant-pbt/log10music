import { CatalogMetricsResponseSchema } from '../../../../docs/specs/catalog.metrics.contract.js';
import { listIssues, listProducts, listSyncRuns } from '../../../../src/catalog/persistence/catalogDb.js';

export async function GET(_request: Request) {
  const [runs, issues, products] = await Promise.all([
    listSyncRuns(),
    listIssues(),
    listProducts(),
  ]);
  const windowHours = 24;
  const now = Date.now();
  const runsLast24h = runs.filter((run) => {
    const startedAt = Date.parse(run.startedAt || '');
    if (Number.isNaN(startedAt)) return false;
    return startedAt >= now - windowHours * 60 * 60 * 1000;
  }).length;
  const metrics = {
    windowHours,
    runsTotal: runs.length,
    runsLast24h,
    issuesTotal: issues.length,
    issuesAmbiguous: issues.filter((issue) => issue.type === 'ambiguous_model').length,
    filesProcessedTotal: runs.reduce((sum, run) => sum + (run.stats?.filesProcessed || 0), 0),
    rowsParsedTotal: runs.reduce((sum, run) => sum + (run.stats?.rowsParsed || 0), 0),
  };
  const payload = CatalogMetricsResponseSchema.parse(metrics);
  return Response.json(payload);
}
