function getGeneralArchitecture() {
  return {
    style: 'Arquitectura basada en componentes (Next.js/React) con una API Route para la gestión de datos.',
    highLevelDiagram: 'Cliente -> Servidor (Next.js) -> Base de Datos (PostgreSQL/Supabase).',
    designPattern: 'Container-Presenter para separar la lógica del administrador de la UI de la landing.',
    contextBoundaries: ['Módulo de Cliente (público)', 'Módulo de Administración (privado)']
  };
}

module.exports = { getGeneralArchitecture };
