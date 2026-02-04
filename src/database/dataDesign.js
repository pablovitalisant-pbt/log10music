function getDataDesign() {
  return {
    conceptualModel: 'Relación simple entre Configuración de Sitio y Registros de Leads.',
    schemas: {
      leads: ['id(UUID)', 'full_name', 'company', 'phone', 'source', 'created_at'],
      site_config: ['id', 'header_code(TEXT)', 'footer_code(TEXT)', 'updated_at']
    },
    partitioning: 'No requerido inicialmente.',
    schemaVersioning: 'Migraciones mediante SQL o Prisma.'
  };
}

module.exports = { getDataDesign };
