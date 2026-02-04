function getProjectBusinessDefinition() {
  return {
    vision: 'Digitalizar la captación de clientes de audio profesional en Bolivia mediante una landing page de alto impacto que refleje autoridad y modernidad.',
    objective: 'Convertir visitantes en leads calificados mediante un diagnóstico gratuito.',
    useCases: [
      'El usuario navega por la landing, ve el stock y solicita un diagnóstico mediante un formulario.',
      'El administrador accede a un panel privado para insertar scripts de seguimiento (Píxeles) sin tocar el código fuente.'
    ],
    stakeholders: ['Dueños de Log10Music', 'Equipo de Marketing', 'Profesionales de audio/Rental'],
    successMetrics: [
      'Tasa de conversión de formularios',
      'Tiempo de carga inferior a 2 segundos',
      'Correcta ejecución de scripts externos'
    ],
    designConstraint: 'El diseño debe ser idéntico al HTML/Tailwind proporcionado por Stitch.',
    risks: ['Inyección de código malicioso a través del panel de scripts', 'Pérdida de performance por exceso de scripts en el header']
  };
}

module.exports = { getProjectBusinessDefinition };
