const { getSecretsAndCredentialsPolicy } = require('../../src/security/secretsAndCredentialsPolicy');

describe('slice-032: secretos y credenciales', () => {
  it('define gestión, secretos requeridos, rotación y acceso', () => {
    const policy = getSecretsAndCredentialsPolicy();
    expect(policy.secretManagement).toBe('Variables de entorno de Vercel.');
    expect(policy.requiredSecrets).toEqual(['DATABASE_URL', 'NEXTAUTH_SECRET', 'ADMIN_PASSWORD']);
    expect(policy.rotation).toBe('Semestral.');
    expect(policy.access).toBe('Solo el personal técnico autorizado.');
  });
});
