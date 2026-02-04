const { getDetailedEndpoints } = require('../../src/apis/detailedEndpoints');

describe('slice-011: endpoints detallados', () => {
  it('define los cuatro endpoints esperados y su propósito', () => {
    const endpoints = getDetailedEndpoints();
    expect(endpoints['POST /api/leads']).toBe('Recibe datos del formulario de la landing.');
    expect(endpoints['GET /api/config']).toBe('Obtiene los scripts para inyectar (público pero cacheado).');
    expect(endpoints['PUT /api/config']).toBe('Actualiza los scripts (requiere Auth).');
    expect(endpoints['GET /api/leads']).toBe('Lista de capturas para el admin (requiere Auth).');
  });
});
