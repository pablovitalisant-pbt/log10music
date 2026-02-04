const { getExternalIntegrations } = require('../../src/integrations/externalIntegrations');

describe('slice-012: integraciones externas', () => {
  it('define API de terceros, webhook y mensajería', () => {
    const integrations = getExternalIntegrations();
    expect(integrations.thirdPartyApis).toBe('WhatsApp Business API (opcional para alertas).');
    expect(integrations.webhooks).toBe('Notificación a Slack cuando entra un nuevo lead.');
    expect(integrations.messaging).toBe('No aplica.');
  });
});
