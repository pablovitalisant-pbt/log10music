const { getAuthAuthorizationConfig } = require('../../src/auth/authAuthorizationConfig');

describe('slice-009: autenticación y autorización', () => {
  it('define método, provider, RBAC, rol, tokens y MFA', () => {
    const auth = getAuthAuthorizationConfig();
    expect(auth.authenticationMethod).toBe('JWT (JSON Web Tokens).');
    expect(auth.providers).toEqual(['NextAuth.js', 'Supabase Auth']);
    expect(auth.permissionModel).toBe('RBAC (Admin solamente).');
    expect(auth.roles).toEqual([{ role: 'SuperAdmin', access: 'total' }]);
    expect(auth.tokenManagement).toBe('Almacenados en cookies HttpOnly para seguridad.');
    expect(auth.mfa).toBe('Recomendado para el acceso al panel de control.');
  });
});
