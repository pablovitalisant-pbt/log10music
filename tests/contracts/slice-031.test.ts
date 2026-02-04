const { getMaintenancePolicy } = require('../../src/operations/maintenancePolicy');

describe('slice-031: mantenimiento', () => {
  it('define revisión mensual de scripts externos', () => {
    expect(getMaintenancePolicy()).toBe('Revisión mensual de scripts externos para asegurar que no ralentizan el sitio.');
  });
});
