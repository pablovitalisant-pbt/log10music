const { getComponentsAndModules } = require('../../src/frontend/componentsAndModules');

describe('slice-018: componentes y módulos', () => {
  it('define frontend, backend, módulos y dependencia principal', () => {
    const model = getComponentsAndModules();
    expect(model.frontend).toBe('Single Page Application (SPA) para la landing y Dashboard para el admin.');
    expect(model.backend).toBe('API Endpoints para guardar leads y actualizar configuraciones de scripts.');
    expect(model.modules).toEqual(['Leads', 'Settings (Scripts)', 'Auth']);
    expect(model.moduleDependency).toBe('Settings inyecta datos en el Layout principal del Frontend.');
  });
});
