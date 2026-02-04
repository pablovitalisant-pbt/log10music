function getTestTypes() {
  return {
    unitTests: 'Vitest.',
    performanceTests: 'k6 para simular tráfico en campañas.',
    securityTests: 'Escaneo de dependencias (Audit).'
  };
}

module.exports = { getTestTypes };
