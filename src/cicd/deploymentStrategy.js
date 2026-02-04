function getDeploymentStrategy() {
  return {
    environments: ['development', 'production'],
    releaseStrategy: 'Atomic deployments (Vercel).',
    rollbackPlan: 'Instant Revert desde el dashboard de Vercel.'
  };
}

module.exports = { getDeploymentStrategy };
