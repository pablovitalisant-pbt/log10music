function getDetailedEndpoints() {
  return {
    'POST /api/leads': 'Recibe datos del formulario de la landing.',
    'GET /api/config': 'Obtiene los scripts para inyectar (público pero cacheado).',
    'PUT /api/config': 'Actualiza los scripts (requiere Auth).',
    'GET /api/leads': 'Lista de capturas para el admin (requiere Auth).'
  };
}

module.exports = { getDetailedEndpoints };
