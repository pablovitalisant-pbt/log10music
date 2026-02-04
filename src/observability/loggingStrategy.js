function getLoggingStrategy() {
  return {
    strategy: 'Registro de intentos de login fallidos y errores de envío de leads.',
    centralization: 'Vercel Logs o Sentry.'
  };
}

module.exports = { getLoggingStrategy };
