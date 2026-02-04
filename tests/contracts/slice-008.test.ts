const { getDataStrategies } = require('../../src/database/dataStrategies');

describe('slice-008: estrategias de datos', () => {
  it('define backup, replicación y consistencia', () => {
    const strategies = getDataStrategies();
    expect(strategies.backupRecovery).toBe('Backups diarios automáticos en Supabase.');
    expect(strategies.replication).toBe('No requerida.');
    expect(strategies.consistency).toBe('Strong consistency para la configuración del sitio.');
  });
});
