const { getObservabilityMetrics } = require('../../src/observability/metrics');

describe('slice-015: métricas', () => {
  it('define métricas clave y objetivo SLI/SLO', () => {
    const metrics = getObservabilityMetrics();
    expect(metrics.keyMetrics).toEqual(['Tasa de éxito de formularios', 'errores 500 en la API']);
    expect(metrics.sliSlo).toBe('Tiempo de respuesta de API < 200ms.');
  });
});
