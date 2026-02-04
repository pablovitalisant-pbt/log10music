const { getDisasterRecoveryPlan } = require('../../src/operations/disasterRecoveryPlan');

describe('slice-030: disaster recovery', () => {
  it('define exportación semanal de leads', () => {
    expect(getDisasterRecoveryPlan()).toBe('Exportación semanal de la tabla de Leads a CSV/JSON externo.');
  });
});
