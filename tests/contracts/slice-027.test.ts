const { getRuntimeConfigurationPolicy } = require('../../src/cicd/runtimeConfigurationPolicy');

describe('slice-027: configuración', () => {
  it('define carga dinámica de variables por ambiente', () => {
    expect(getRuntimeConfigurationPolicy()).toBe('Variables de entorno cargadas dinámicamente según el ambiente.');
  });
});
