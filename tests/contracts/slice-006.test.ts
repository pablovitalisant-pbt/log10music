const { getDataDesign } = require('../../src/database/dataDesign');

describe('slice-006: diseño de datos', () => {
  it('define modelo conceptual, esquemas, particionamiento y versionado', () => {
    const design = getDataDesign();
    expect(design.conceptualModel).toBe('Relación simple entre Configuración de Sitio y Registros de Leads.');
    expect(design.schemas.leads).toEqual(['id(UUID)', 'full_name', 'company', 'phone', 'source', 'created_at']);
    expect(design.schemas.site_config).toEqual(['id', 'header_code(TEXT)', 'footer_code(TEXT)', 'updated_at']);
    expect(design.partitioning).toBe('No requerido inicialmente.');
    expect(design.schemaVersioning).toBe('Migraciones mediante SQL o Prisma.');
  });
});
