import {
  SyncRunsResponseSchema,
} from '../../../../docs/specs/catalog.sync.contract.js';
import { createSyncRunRepo } from '../../../../src/catalog/repositories/syncRunRepo.js';
import { listSyncRuns } from '../../../../src/catalog/services/catalogSyncService.js';

export async function GET(_request: Request) {
  const syncRunRepo = createSyncRunRepo();
  const items = listSyncRuns({ syncRunRepo });
  const payload = SyncRunsResponseSchema.parse({ items });
  return Response.json(payload);
}
