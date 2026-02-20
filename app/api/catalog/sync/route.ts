import {
  SyncBadRequestSchema,
  SyncRequestSchema,
} from '../../../../docs/specs/catalog.sync.contract.js';
import { SyncRunSchema } from '../../../../docs/specs/catalog.foundation.contract.js';
import { createDriveClient } from '../../../../src/catalog/drive/driveClient.js';
import { createCatalogProductRepo } from '../../../../src/catalog/repositories/catalogProductRepo.js';
import { createCatalogSourceRepo } from '../../../../src/catalog/repositories/catalogSourceRepo.js';
import { createIssueRepo } from '../../../../src/catalog/repositories/issueRepo.js';
import { createSourceFileRepo } from '../../../../src/catalog/repositories/sourceFileRepo.js';
import { createSourceRowRepo } from '../../../../src/catalog/repositories/sourceRowRepo.js';
import { createSyncRunRepo } from '../../../../src/catalog/repositories/syncRunRepo.js';
import { createVendorRepo } from '../../../../src/catalog/repositories/vendorRepo.js';
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
  const driveClient = createDriveClient();
  const vendorRepo = createVendorRepo();
  const sourceFileRepo = createSourceFileRepo();
  const sourceRowRepo = createSourceRowRepo();
  const issueRepo = createIssueRepo();
  const catalogProductRepo = createCatalogProductRepo();
  const catalogSourceRepo = createCatalogSourceRepo();
  const maxFilesPerVendor = process.env.SYNC_MAX_FILES_PER_VENDOR
    ? Number(process.env.SYNC_MAX_FILES_PER_VENDOR)
    : 10;
  const maxRowsPerFile = process.env.SYNC_MAX_ROWS_PER_FILE
    ? Number(process.env.SYNC_MAX_ROWS_PER_FILE)
    : 5000;
  const deadlineMs = process.env.SYNC_DEADLINE_MS ? Number(process.env.SYNC_DEADLINE_MS) : 240000;
  const run = await runCatalogSync({
    syncRunRepo,
    driveClient,
    vendorRepo,
    sourceFileRepo,
    sourceRowRepo,
    issueRepo,
    catalogProductRepo,
    catalogSourceRepo,
    maxFilesPerVendor,
    maxRowsPerFile,
    deadlineMs,
  });
  const payload = SyncRunSchema.parse(run);
  return Response.json(payload);
}
