function getAuthAuthorizationConfig() {
  return {
    authenticationMethod: 'JWT (JSON Web Tokens).',
    providers: ['NextAuth.js', 'Supabase Auth'],
    permissionModel: 'RBAC (Admin solamente).',
    roles: [{ role: 'SuperAdmin', access: 'total' }],
    tokenManagement: 'Almacenados en cookies HttpOnly para seguridad.',
    mfa: 'Recomendado para el acceso al panel de control.'
  };
}

module.exports = { getAuthAuthorizationConfig };
