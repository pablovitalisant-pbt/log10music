import {
  DriveFilesBadRequestSchema,
  DriveFilesResponseSchema,
} from '../../../../docs/specs/catalog.drive.contract.js';
import { createDriveClient } from '../../../../src/catalog/drive/driveClient.js';
import { createSourceFileRepo } from '../../../../src/catalog/repositories/sourceFileRepo.js';
import { discoverFiles } from '../../../../src/catalog/services/driveDiscovery.js';

const FALLBACK_FILES = [
  {
    fileId: 'file-1',
    vendorId: 'vendor-1',
    fileName: 'lista-a.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    modifiedTime: '2026-02-19T12:00:00.000Z',
  },
  {
    fileId: 'file-2',
    vendorId: 'vendor-2',
    fileName: 'lista-b.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    modifiedTime: '2026-02-19T12:00:00.000Z',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vendorId = searchParams.get('vendorId');
  if (!vendorId) {
    const payload = DriveFilesBadRequestSchema.parse({ error: 'vendorId is required' });
    return Response.json(payload, { status: 400 });
  }
  const driveClient = createDriveClient({ files: FALLBACK_FILES });
  const sourceFileRepo = createSourceFileRepo();
  const items = discoverFiles({ driveClient, sourceFileRepo, vendorId });
  const payload = DriveFilesResponseSchema.parse({ items });
  return Response.json(payload);
}
