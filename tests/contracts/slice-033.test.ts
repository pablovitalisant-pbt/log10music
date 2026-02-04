const { getInfrastructureAsCodeTool } = require('../../src/cicd/infrastructureAsCodeTool');

describe('slice-033: infrastructure as code', () => {
  it('define herramienta de IaC', () => {
    expect(getInfrastructureAsCodeTool()).toBe('Configuración mediante vercel.json.');
  });
});
