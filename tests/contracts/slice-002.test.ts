const { getFunctionalNonFunctionalRequirements } = require('../../src/setup/functionalNonFunctionalRequirements');

describe('slice-002: requerimientos funcionales y no funcionales', () => {
  it('define funcionalidades y NFR principales del sistema', () => {
    const req = getFunctionalNonFunctionalRequirements();
    expect(req.functionalities).toEqual([
      'Landing page con estética industrial (Mayores de prioridad).',
      'Formulario modal de captura de datos (Nombre, Empresa, WhatsApp).',
      'Panel de administración protegido.',
      'Sistema de inyección dinámica de código en <head> y antes de </body>.'
    ]);
    expect(req.performance).toBe('Carga optimizada de imágenes pesadas; Score de Lighthouse > 90.');
    expect(req.scalability).toMatch(/picos de tráfico/);
    expect(req.availability).toBe('99.9% mediante despliegue en infraestructuras edge (Vercel/Netlify).');
    expect(req.security).toMatch(/Autenticación para el admin/);
    expect(req.usability).toMatch(/responsive/);
  });
});
