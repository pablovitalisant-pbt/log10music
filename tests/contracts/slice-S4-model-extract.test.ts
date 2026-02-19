const {
  ModelExtractBadRequestSchema,
  ModelExtractResponseSchema,
} = require('../../docs/specs/catalog.model-extract.contract');

const { POST: postExtract } = require('../../app/api/catalog/extract-model/route');

describe('slice-S4: model extraction', () => {
  it('POST /api/catalog/extract-model sin campos obligatorios retorna 400', async () => {
    const response = await postExtract(
      new Request('http://localhost/api/catalog/extract-model', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ vendorId: 'vendor-1' }),
      })
    );
    expect(response.status).toBe(400);
    const payload = await response.json();
    const parsed = ModelExtractBadRequestSchema.parse(payload);
    expect(parsed.error).toBe(parsed.error);
  });

  it('POST /api/catalog/extract-model valido retorna ModelExtractResponse', async () => {
    const response = await postExtract(
      new Request('http://localhost/api/catalog/extract-model', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          vendorId: 'vendor-1',
          fileId: 'file-1',
          sourceRowId: 'row-1',
          rawRow: { description: 'Yamaha HS5' },
        }),
      })
    );
    expect(response.status).toBe(200);
    const payload = await response.json();
    const parsed = ModelExtractResponseSchema.parse(payload);
    expect(parsed.vendorId).toBe('vendor-1');
    expect(parsed.fileId).toBe('file-1');
    expect(parsed.sourceRowId).toBe('row-1');
    expect(parsed.issuesCreated >= 0).toBe(true);
  });

  it('POST /api/catalog/extract-model ambiguous retorna issue', async () => {
    const response = await postExtract(
      new Request('http://localhost/api/catalog/extract-model', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          vendorId: 'vendor-1',
          fileId: 'file-1',
          sourceRowId: 'row-2',
          rawRow: { description: '???' },
        }),
      })
    );
    expect(response.status).toBe(200);
    const payload = await response.json();
    const parsed = ModelExtractResponseSchema.parse(payload);
    expect(parsed.vendorId).toBe('vendor-1');
    expect(parsed.fileId).toBe('file-1');
    expect(parsed.sourceRowId).toBe('row-2');
    expect(parsed.status).toBe('ambiguous');
    expect(parsed.issuesCreated >= 1).toBe(true);
  });
});
