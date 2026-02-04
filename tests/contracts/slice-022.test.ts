const { getTestingStrategy } = require('../../src/testing/testingStrategy');

describe('slice-022: estrategia de testing', () => {
  it('define unit, integration y e2e tests esperados', () => {
    const strategy = getTestingStrategy();
    expect(strategy.unitTests).toBe('Validación de lógica de procesamiento de leads.');
    expect(strategy.integrationTests).toBe('Prueba de guardado en DB desde el formulario.');
    expect(strategy.e2eTests).toBe('Playwright para asegurar que los scripts inyectados aparecen en el DOM.');
  });
});
