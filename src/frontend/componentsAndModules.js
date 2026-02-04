function getComponentsAndModules() {
  return {
    frontend: 'Single Page Application (SPA) para la landing y Dashboard para el admin.',
    backend: 'API Endpoints para guardar leads y actualizar configuraciones de scripts.',
    modules: ['Leads', 'Settings (Scripts)', 'Auth'],
    moduleDependency: 'Settings inyecta datos en el Layout principal del Frontend.'
  };
}

module.exports = { getComponentsAndModules };
