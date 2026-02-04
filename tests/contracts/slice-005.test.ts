const { getSecurityInfrastructure } = require('../../src/setup/securityInfrastructure');

describe('slice-005: seguridad de infraestructura', () => {
  it('define reglas de firewall y security groups', () => {
    const security = getSecurityInfrastructure();
    expect(security.firewallRules).toBe('Solo accesos HTTPS.');
    expect(security.securityGroups).toBe('Configuración por defecto de Vercel.');
  });
});
