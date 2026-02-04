const { getAlertingPolicy } = require('../../src/observability/alertingPolicy');

describe('slice-017: alerting', () => {
  it('define notificaciones por email ante fallos de base de datos', () => {
    expect(getAlertingPolicy()).toBe('Notificaciones vía email ante fallos en la base de datos.');
  });
});
