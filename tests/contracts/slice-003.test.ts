const { getGeneralArchitecture } = require('../../src/setup/generalArchitecture');

describe('slice-003: arquitectura general', () => {
  it('define estilo, diagrama, patrón y fronteras de contexto', () => {
    const architecture = getGeneralArchitecture();
    expect(architecture.style).toMatch(/Arquitectura basada en componentes/);
    expect(architecture.highLevelDiagram).toBe('Cliente -> Servidor (Next.js) -> Base de Datos (PostgreSQL/Supabase).');
    expect(architecture.designPattern).toBe('Container-Presenter para separar la lógica del administrador de la UI de la landing.');
    expect(architecture.contextBoundaries).toEqual(['Módulo de Cliente (público)', 'Módulo de Administración (privado)']);
  });
});
