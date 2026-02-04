function getSecretsAndCredentialsPolicy() {
  return {
    secretManagement: 'Variables de entorno de Vercel.',
    requiredSecrets: ['DATABASE_URL', 'NEXTAUTH_SECRET', 'ADMIN_PASSWORD'],
    rotation: 'Semestral.',
    access: 'Solo el personal técnico autorizado.'
  };
}

module.exports = { getSecretsAndCredentialsPolicy };
