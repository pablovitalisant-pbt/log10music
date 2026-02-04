function getInfrastructureSetup() {
  return {
    cloudProvider: 'Vercel (Frontend/Serverless) + Supabase (DB).',
    region: 'us-east-1',
    networking: 'HTTPS obligatorio; CDN de Vercel para assets.',
    compute: 'Serverless Functions para el manejo de formularios y login.'
  };
}

module.exports = { getInfrastructureSetup };
