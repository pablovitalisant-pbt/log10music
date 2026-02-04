function getCiCdPipeline() {
  return {
    tool: 'GitHub Actions conectado a Vercel.',
    stages: ['Build', 'Test', 'Preview', 'Production']
  };
}

module.exports = { getCiCdPipeline };
