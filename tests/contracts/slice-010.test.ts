const { getApiDesign } = require('../../src/apis/apiDesign');

describe('slice-010: api design', () => {
  it('define estilo, versionado y documentación', () => {
    const api = getApiDesign();
    expect(api.style).toBe('REST.');
    expect(api.versioning).toBe('/v1/.');
    expect(api.documentation).toBe('Swagger/Postman interno.');
  });
});
