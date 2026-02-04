const { getInfrastructureSetup } = require('../../src/setup/infrastructureSetup');

describe('slice-004: infraestructura', () => {
  it('define cloud, región, networking y cómputo esperados', () => {
    const infra = getInfrastructureSetup();
    expect(infra.cloudProvider).toBe('Vercel (Frontend/Serverless) + Supabase (DB).');
    expect(infra.region).toBe('us-east-1');
    expect(infra.networking).toBe('HTTPS obligatorio; CDN de Vercel para assets.');
    expect(infra.compute).toBe('Serverless Functions para el manejo de formularios y login.');
  });
});
