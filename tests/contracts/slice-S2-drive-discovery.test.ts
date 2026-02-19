const {
  DriveVendorsResponseSchema,
  DriveFilesResponseSchema,
  DriveFilesBadRequestSchema,
} = require('../../docs/specs/catalog.drive.contract');

const { GET: getVendors } = require('../../app/api/catalog/vendors/route');
const { GET: getFiles } = require('../../app/api/catalog/files/route');

describe('slice-S2: drive discovery endpoints', () => {
  it('GET /api/catalog/vendors retorna items validos', async () => {
    const response = await getVendors(new Request('http://localhost/api/catalog/vendors'));
    const payload = await response.json();
    const parsed = DriveVendorsResponseSchema.parse(payload);
    expect(parsed.items).toBe(parsed.items);
  });

  it('GET /api/catalog/files sin vendorId retorna 400', async () => {
    const response = await getFiles(new Request('http://localhost/api/catalog/files'));
    expect(response.status).toBe(400);
    const payload = await response.json();
    const parsed = DriveFilesBadRequestSchema.parse(payload);
    expect(parsed.error).toBe(parsed.error);
  });

  it('GET /api/catalog/files con vendorId retorna items validos', async () => {
    const response = await getFiles(
      new Request('http://localhost/api/catalog/files?vendorId=vendor-1')
    );
    const payload = await response.json();
    const parsed = DriveFilesResponseSchema.parse(payload);
    expect(parsed.items).toBe(parsed.items);
  });
});
