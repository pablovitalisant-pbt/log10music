const {
  MappingBadRequestSchema,
  ModelMappingResponseSchema,
} = require('../../docs/specs/catalog.mapping.contract');

const { POST: postMapping } = require('../../app/api/catalog/mapping/route');

describe('slice-S7: model mapping', () => {
  it('POST /api/catalog/mapping invalido retorna 400', async () => {
    const response = await postMapping(
      new Request('http://localhost/api/catalog/mapping', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          issueId: 'issue-1',
          vendorId: 'vendor-1',
          sourceRowId: 'row-1',
          model: '?',
        }),
      })
    );
    expect(response.status).toBe(400);
    const payload = await response.json();
    const parsed = MappingBadRequestSchema.parse(payload);
    expect(parsed.error).toBe(parsed.error);
  });

  it('POST /api/catalog/mapping valido retorna ModelMappingResponse', async () => {
    const requestBody = {
      issueId: 'issue-1',
      vendorId: 'vendor-1',
      sourceRowId: 'row-1',
      model: 'Yamaha HS5',
      brand: 'Yamaha',
    };
    const response = await postMapping(
      new Request('http://localhost/api/catalog/mapping', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
    );
    expect(response.status).toBe(200);
    const payload = await response.json();
    const parsed = ModelMappingResponseSchema.parse(payload);
    expect(parsed.issueId).toBe(requestBody.issueId);
    expect(parsed.vendorId).toBe(requestBody.vendorId);
    expect(parsed.sourceRowId).toBe(requestBody.sourceRowId);
    expect(parsed.resolved).toBe(true);
    expect(parsed.issuesResolved >= 1).toBe(true);
  });
});
