const { getFrontendPerformancePlan } = require('../../src/frontend/frontendPerformancePlan');

describe('slice-021: performance frontend', () => {
  it('define code splitting, optimización de assets y estrategia de cache', () => {
    const perf = getFrontendPerformancePlan();
    expect(perf.codeSplitting).toBe('Carga dinámica del panel de administración.');
    expect(perf.assetOptimization).toBe('Imágenes en formato WebP.');
    expect(perf.cachingStrategy).toBe('Incremental Static Regeneration (ISR) para la landing.');
  });
});
