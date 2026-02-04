const { getTestTypes } = require('../../src/testing/testTypes');

describe('slice-023: tipos de tests', () => {
  it('define unit, performance y security tests', () => {
    const types = getTestTypes();
    expect(types.unitTests).toBe('Vitest.');
    expect(types.performanceTests).toBe('k6 para simular tráfico en campañas.');
    expect(types.securityTests).toBe('Escaneo de dependencias (Audit).');
  });
});
