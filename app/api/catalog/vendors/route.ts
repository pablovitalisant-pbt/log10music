import { DriveVendorsResponseSchema } from '../../../../docs/specs/catalog.drive.contract.js';
import { createDriveClient } from '../../../../src/catalog/drive/driveClient.js';
import { createVendorRepo } from '../../../../src/catalog/repositories/vendorRepo.js';
import { discoverVendors } from '../../../../src/catalog/services/driveDiscovery.js';

export async function GET(_request: Request) {
  const driveClient = createDriveClient();
  const vendorRepo = createVendorRepo();
  const items = await discoverVendors({ driveClient, vendorRepo });
  const payload = DriveVendorsResponseSchema.parse({ items });
  return Response.json(payload);
}
