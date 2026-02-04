function getExternalIntegrations() {
  return {
    thirdPartyApis: 'WhatsApp Business API (opcional para alertas).',
    webhooks: 'Notificación a Slack cuando entra un nuevo lead.',
    messaging: 'No aplica.'
  };
}

module.exports = { getExternalIntegrations };
