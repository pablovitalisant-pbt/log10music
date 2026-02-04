function getDataStrategies() {
  return {
    backupRecovery: 'Backups diarios automáticos en Supabase.',
    replication: 'No requerida.',
    consistency: 'Strong consistency para la configuración del sitio.'
  };
}

module.exports = { getDataStrategies };
