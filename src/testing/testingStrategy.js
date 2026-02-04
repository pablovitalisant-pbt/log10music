function getTestingStrategy() {
  return {
    unitTests: 'Validación de lógica de procesamiento de leads.',
    integrationTests: 'Prueba de guardado en DB desde el formulario.',
    e2eTests: 'Playwright para asegurar que los scripts inyectados aparecen en el DOM.'
  };
}

module.exports = { getTestingStrategy };
