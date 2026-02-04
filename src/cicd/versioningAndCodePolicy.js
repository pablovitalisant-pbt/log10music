function getVersioningAndCodePolicy() {
  return {
    branchingStrategy: { production: 'main', integration: 'develop' },
    commitConventions: ['feat:', 'fix:', 'style:'],
    codeReview: 'Obligatorio para cambios en el módulo de inyección de scripts.'
  };
}

module.exports = { getVersioningAndCodePolicy };
