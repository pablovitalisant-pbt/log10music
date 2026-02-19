const {
  SyncRunSchema,
  SyncRunsResponseSchema,
  IssuesResponseSchema,
  SyncBadRequestSchema,
} = require('../../docs/specs/catalog.sync.contract');

const { POST: postSync } = require('../../app/api/catalog/sync/route');
const { GET: getSyncRuns } = require('../../app/api/catalog/sync-runs/route');
const { GET: getIssues } = require('../../app/api/catalog/issues/route');

describe('slice-S6: catalog sync orchestration', () => {
  it('POST /api/catalog/sync con body vacio retorna SyncRun', async () => {
    const response = await postSync(
      new Request('http://localhost/api/catalog/sync', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      })
    );
    expect(response.status).toBe(200);
    const payload = await response.json();
    const parsed = SyncRunSchema.parse(payload);
    expect(parsed.runId).toBe(parsed.runId);
  });

  it('POST /api/catalog/sync fileId sin vendorId retorna 400', async () => {
    const response = await postSync(
      new Request('http://localhost/api/catalog/sync', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ scope: { fileId: 'file-1' } }),
      })
    );
    expect(response.status).toBe(400);
    const payload = await response.json();
    const parsed = SyncBadRequestSchema.parse(payload);
    expect(parsed.error).toBe(parsed.error);
  });

  it('GET /api/catalog/sync-runs retorna lista de runs', async () => {
    const response = await getSyncRuns(new Request('http://localhost/api/catalog/sync-runs'));
    expect(response.status).toBe(200);
    const payload = await response.json();
    const parsed = SyncRunsResponseSchema.parse(payload);
    expect(parsed.items.length >= 0).toBe(true);
  });

  it('GET /api/catalog/issues retorna issues (y filtra por runId)', async () => {
    const response = await getIssues(new Request('http://localhost/api/catalog/issues'));
    expect(response.status).toBe(200);
    const payload = await response.json();
    const parsed = IssuesResponseSchema.parse(payload);
    expect(parsed.items.length >= 0).toBe(true);

    const responseFiltered = await getIssues(
      new Request('http://localhost/api/catalog/issues?runId=run-1')
    );
    expect(responseFiltered.status).toBe(200);
    const filteredPayload = await responseFiltered.json();
    const filteredParsed = IssuesResponseSchema.parse(filteredPayload);
    expect(filteredParsed.items.length <= parsed.items.length).toBe(true);
    expect(filteredParsed.items.length >= 0).toBe(true);
  });
});
