const { getFrontendArchitecture } = require('../../src/frontend/frontendArchitecture');

describe('slice-019: arquitectura frontend', () => {
  it('define framework, estado, rutas y estructura de componentes', () => {
    const arch = getFrontendArchitecture();
    expect(arch.framework).toBe('Next.js 14+ (App Router).');
    expect(arch.stateManagement).toBe('React Context para el estado del formulario.');
    expect(arch.routing).toEqual(['/', '/admin', '/admin/dashboard']);
    expect(arch.componentStructure).toEqual(['Header', 'Hero', 'ChaosSection', 'PricingTable', 'FAQ', 'Footer']);
  });
});
