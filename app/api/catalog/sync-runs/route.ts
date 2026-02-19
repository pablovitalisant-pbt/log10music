import {
  SyncRunsResponseSchema,
} from '../../../../docs/specs/catalog.sync.contract.js';
import { createSyncRunRepo } from '../../../../src/catalog/repositories/syncRunRepo.js';
import { listSyncRuns } from '../../../../src/catalog/services/catalogSyncService.js';

const FALLBACK_RUNS = [
  {
    runId: 'run-1',
    startedAt: '2026-02-19T12:00:00.000Z',
    finishedAt: '2026-02-19T12:00:01.000Z',
    stats: {
      vendorsDetected: 1,
      filesScanned: 1,
      filesProcessed: 1,
      rowsParsed: 0,
      productsAvailable: 0,
      issuesCount: 0,
    },
  },
];

export async function GET(_request: Request) {
  const syncRunRepo = createSyncRunRepo({ store: { runs: FALLBACK_RUNS } });
  const items = listSyncRuns({ syncRunRepo });
  const payload = SyncRunsResponseSchema.parse({ items });
  return Response.json(payload);
}
