const { getApplicationSecurity } = require('../../src/security/applicationSecurity');

describe('slice-013: seguridad de aplicación', () => {
  it('define validación, protecciones, encriptación y headers', () => {
    const security = getApplicationSecurity();
    expect(security.inputValidation).toBe('Zod para validación de esquemas en el servidor.');
    expect(security.protectionAgainst).toBe('XSS (especialmente crítico al renderizar el header/footer inyectado) y CSRF.');
    expect(security.encryption).toBe('TLS 1.3 en tránsito.');
    expect(security.securityHeaders).toBe('Content Security Policy (CSP) ajustada para permitir scripts de Google/FB.');
  });
});
