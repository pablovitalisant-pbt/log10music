const { getVersioningAndCodePolicy } = require('../../src/cicd/versioningAndCodePolicy');

describe('slice-029: gestión de versiones y código', () => {
  it('define branching, convenciones de commits y code review', () => {
    const policy = getVersioningAndCodePolicy();
    expect(policy.branchingStrategy).toEqual({ production: 'main', integration: 'develop' });
    expect(policy.commitConventions).toEqual(['feat:', 'fix:', 'style:']);
    expect(policy.codeReview).toBe('Obligatorio para cambios en el módulo de inyección de scripts.');
  });
});
