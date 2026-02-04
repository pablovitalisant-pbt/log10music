function getSecurityInfrastructure() {
  return {
    firewallRules: 'Solo accesos HTTPS.',
    securityGroups: 'Configuración por defecto de Vercel.'
  };
}

module.exports = { getSecurityInfrastructure };
