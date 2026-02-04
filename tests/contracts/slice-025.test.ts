const { getCiCdPipeline } = require('../../src/cicd/pipeline');

describe('slice-025: pipeline ci/cd', () => {
  it('define herramienta y etapas del pipeline', () => {
    const pipeline = getCiCdPipeline();
    expect(pipeline.tool).toBe('GitHub Actions conectado a Vercel.');
    expect(pipeline.stages).toEqual(['Build', 'Test', 'Preview', 'Production']);
  });
});
