import {
  SyncBadRequestSchema,
  SyncRequestSchema,
} from '../../../../docs/specs/catalog.sync.contract.js';
import { SyncRunSchema } from '../../../../docs/specs/catalog.foundation.contract.js';
import { createSyncRunRepo } from '../../../../src/catalog/repositories/syncRunRepo.js';
import { runCatalogSync } from '../../../../src/catalog/services/catalogSyncService.js';

export async function POST(request: Request) {
  let body = null;
  try {
    body = await request.json();
  } catch (error) {
    const payload = SyncBadRequestSchema.parse({ error: 'Invalid JSON body' });
    return Response.json(payload, { status: 400 });
  }

  const parsed = SyncRequestSchema.safeParse(body || {});
  if (!parsed.success) {
    const payload = SyncBadRequestSchema.parse({ error: 'Invalid sync request' });
    return Response.json(payload, { status: 400 });
  }

  const scope = parsed.data.scope || {};
  if (scope.fileId && !scope.vendorId) {
    const payload = SyncBadRequestSchema.parse({ error: 'vendorId is required for fileId' });
    return Response.json(payload, { status: 400 });
  }

  const syncRunRepo = createSyncRunRepo();
  const run = runCatalogSync({ syncRunRepo });
  const payload = SyncRunSchema.parse(run);
  return Response.json(payload);
}
