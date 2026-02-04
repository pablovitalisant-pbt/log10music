const { getProjectBusinessDefinition } = require('../../src/setup/projectBusinessDefinition');

describe('slice-001: definición del proyecto y negocio', () => {
  it('define visión, casos de uso, stakeholders, métricas, restricción y riesgos clave', () => {
    const def = getProjectBusinessDefinition();
    expect(def.vision).toMatch(/Digitalizar la captación de clientes/);
    expect(def.useCases).toHaveLength(2);
    expect(def.stakeholders).toEqual([
      'Dueños de Log10Music',
      'Equipo de Marketing',
      'Profesionales de audio/Rental'
    ]);
    expect(def.successMetrics).toEqual([
      'Tasa de conversión de formularios',
      'Tiempo de carga inferior a 2 segundos',
      'Correcta ejecución de scripts externos'
    ]);
    expect(def.designConstraint).toBe('El diseño debe ser idéntico al HTML/Tailwind proporcionado por Stitch.');
    expect(def.risks).toEqual([
      'Inyección de código malicioso a través del panel de scripts',
      'Pérdida de performance por exceso de scripts en el header'
    ]);
  });
});
