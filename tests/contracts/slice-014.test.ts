const { getLoggingStrategy } = require('../../src/observability/loggingStrategy');

describe('slice-014: logging', () => {
  it('define estrategia y centralización de logs', () => {
    const logging = getLoggingStrategy();
    expect(logging.strategy).toBe('Registro de intentos de login fallidos y errores de envío de leads.');
    expect(logging.centralization).toBe('Vercel Logs o Sentry.');
  });
});
