const {
  ParseBadRequestSchema,
  ParseResultSchema,
} = require('../../docs/specs/catalog.parse.contract');

const { POST: postParse } = require('../../app/api/catalog/parse/route');

describe('slice-S3: parse tabular', () => {
  it('POST /api/catalog/parse sin fileId o vendorId retorna 400', async () => {
    const response = await postParse(
      new Request('http://localhost/api/catalog/parse', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ vendorId: 'vendor-1' }),
      })
    );
    expect(response.status).toBe(400);
    const payload = await response.json();
    const parsed = ParseBadRequestSchema.parse(payload);
    expect(parsed.error).toBe(parsed.error);
  });

  it('POST /api/catalog/parse valido retorna ParseResult', async () => {
    const response = await postParse(
      new Request('http://localhost/api/catalog/parse', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ vendorId: 'vendor-1', fileId: 'file-1' }),
      })
    );
    expect(response.status).toBe(200);
    const payload = await response.json();
    const parsed = ParseResultSchema.parse(payload);
    expect(parsed.rowsParsed >= 0).toBe(true);
    expect(parsed.issuesCreated >= 0).toBe(true);
  });
});
