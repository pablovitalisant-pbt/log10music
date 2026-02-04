function getObservabilityMetrics() {
  return {
    keyMetrics: ['Tasa de éxito de formularios', 'errores 500 en la API'],
    sliSlo: 'Tiempo de respuesta de API < 200ms.'
  };
}

module.exports = { getObservabilityMetrics };
