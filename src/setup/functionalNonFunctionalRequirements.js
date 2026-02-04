function getFunctionalNonFunctionalRequirements() {
  return {
    functionalities: [
      'Landing page con estética industrial (Mayores de prioridad).',
      'Formulario modal de captura de datos (Nombre, Empresa, WhatsApp).',
      'Panel de administración protegido.',
      'Sistema de inyección dinámica de código en <head> y antes de </body>.'
    ],
    performance: 'Carga optimizada de imágenes pesadas; Score de Lighthouse > 90.',
    scalability: 'Capacidad para manejar picos de tráfico durante eventos o lanzamientos de stock en Iquique.',
    availability: '99.9% mediante despliegue en infraestructuras edge (Vercel/Netlify).',
    security: 'Autenticación para el admin; sanitización de entradas en el formulario de leads.',
    usability: 'Diseño totalmente responsive que mantenga los efectos skew y glitch en móviles.'
  };
}

module.exports = { getFunctionalNonFunctionalRequirements };
