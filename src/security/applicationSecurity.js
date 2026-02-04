function getApplicationSecurity() {
  return {
    inputValidation: 'Zod para validación de esquemas en el servidor.',
    protectionAgainst: 'XSS (especialmente crítico al renderizar el header/footer inyectado) y CSRF.',
    encryption: 'TLS 1.3 en tránsito.',
    securityHeaders: 'Content Security Policy (CSP) ajustada para permitir scripts de Google/FB.'
  };
}

module.exports = { getApplicationSecurity };
