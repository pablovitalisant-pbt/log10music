function getFrontendArchitecture() {
  return {
    framework: 'Next.js 14+ (App Router).',
    stateManagement: 'React Context para el estado del formulario.',
    routing: ['/', '/admin', '/admin/dashboard'],
    componentStructure: ['Header', 'Hero', 'ChaosSection', 'PricingTable', 'FAQ', 'Footer']
  };
}

module.exports = { getFrontendArchitecture };
