const { getDeploymentStrategy } = require('../../src/cicd/deploymentStrategy');

describe('slice-026: estrategia de deployment', () => {
  it('define ambientes, release strategy y rollback plan', () => {
    const strategy = getDeploymentStrategy();
    expect(strategy.environments).toEqual(['development', 'production']);
    expect(strategy.releaseStrategy).toBe('Atomic deployments (Vercel).');
    expect(strategy.rollbackPlan).toBe('Instant Revert desde el dashboard de Vercel.');
  });
});
