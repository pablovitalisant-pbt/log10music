function getFrontendPerformancePlan() {
  return {
    codeSplitting: 'Carga dinámica del panel de administración.',
    assetOptimization: 'Imágenes en formato WebP.',
    cachingStrategy: 'Incremental Static Regeneration (ISR) para la landing.'
  };
}

module.exports = { getFrontendPerformancePlan };
