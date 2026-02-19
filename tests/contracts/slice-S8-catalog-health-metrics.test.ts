const {
  CatalogHealthResponseSchema,
} = require('../../docs/specs/catalog.health.contract');
const {
  CatalogMetricsResponseSchema,
} = require('../../docs/specs/catalog.metrics.contract');

const { GET: getHealth } = require('../../app/api/catalog/health/route');
const { GET: getMetrics } = require('../../app/api/catalog/metrics/route');

describe('slice-S8: catalog health and metrics', () => {
  it('GET /api/catalog/health retorna health valido', async () => {
    const response = await getHealth(new Request('http://localhost/api/catalog/health'));
    expect(response.status).toBe(200);
    const payload = await response.json();
    const parsed = CatalogHealthResponseSchema.parse(payload);
    if (parsed.lastSyncAt === null) {
      expect(parsed.staleMinutes).toBe(null);
      const hasNoSync = parsed.reasonCodes.includes('no_sync_yet');
      const isNotOk = parsed.status !== 'ok';
      expect(hasNoSync || isNotOk).toBe(true);
    }
  });

  it('GET /api/catalog/metrics retorna metrics valido', async () => {
    const response = await getMetrics(new Request('http://localhost/api/catalog/metrics'));
    expect(response.status).toBe(200);
    const payload = await response.json();
    const parsed = CatalogMetricsResponseSchema.parse(payload);
    expect(parsed.windowHours).toBe(24);
    expect(parsed.runsTotal >= 0).toBe(true);
    expect(parsed.runsLast24h >= 0).toBe(true);
    expect(parsed.issuesTotal >= 0).toBe(true);
    expect(parsed.issuesAmbiguous >= 0).toBe(true);
    expect(parsed.filesProcessedTotal >= 0).toBe(true);
    expect(parsed.rowsParsedTotal >= 0).toBe(true);
  });
});
