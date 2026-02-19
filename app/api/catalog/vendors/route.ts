import { DriveVendorsResponseSchema } from '../../../../docs/specs/catalog.drive.contract.js';
import { createDriveClient } from '../../../../src/catalog/drive/driveClient.js';
import { createVendorRepo } from '../../../../src/catalog/repositories/vendorRepo.js';
import { discoverVendors } from '../../../../src/catalog/services/driveDiscovery.js';

const FALLBACK_VENDORS = [
  { vendorId: 'vendor-1', name: 'Importadora A' },
  { vendorId: 'vendor-2', name: 'Importadora B' },
];

export async function GET(_request: Request) {
  const driveClient = createDriveClient({ vendors: FALLBACK_VENDORS });
  const vendorRepo = createVendorRepo();
  const items = discoverVendors({ driveClient, vendorRepo });
  const payload = DriveVendorsResponseSchema.parse({ items });
  return Response.json(payload);
}
