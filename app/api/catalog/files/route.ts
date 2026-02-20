import {
  DriveFilesBadRequestSchema,
  DriveFilesResponseSchema,
} from '../../../../docs/specs/catalog.drive.contract.js';
import { createDriveClient } from '../../../../src/catalog/drive/driveClient.js';
import { createSourceFileRepo } from '../../../../src/catalog/repositories/sourceFileRepo.js';
import { discoverFiles } from '../../../../src/catalog/services/driveDiscovery.js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get('vendorId');
  if (!vendorId) {
    const payload = DriveFilesBadRequestSchema.parse({ error: 'vendorId is required' });
    return Response.json(payload, { status: 400 });
  }
  const driveClient = createDriveClient();
  const sourceFileRepo = createSourceFileRepo();
  const items = await discoverFiles({ driveClient, sourceFileRepo, vendorId });
  const payload = DriveFilesResponseSchema.parse({ items });
  return Response.json(payload);
}
