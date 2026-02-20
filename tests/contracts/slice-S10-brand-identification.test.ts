const {
  BrandIdentificationRequestSchema,
  BrandIdentificationResultSchema,
} = require('../../docs/specs/catalog.brand-identification.contract');

const { identifyBrandFromRow } = require('../../src/catalog/extract/modelExtractor');

describe('slice-S10: brand identification engine', () => {
  it('identifica marca desde columna Brand/Marca', () => {
    const input = { rawRow: { brand: 'Yamaha', model: 'HS5' } };
    const parsedInput = BrandIdentificationRequestSchema.parse(input);
    const result = identifyBrandFromRow(parsedInput.rawRow);
    const parsed = BrandIdentificationResultSchema.parse(result);
    expect(parsed.brand).toBe('Yamaha');
    expect(parsed.method).toBe('header');
    expect(parsed.confidence >= 0.8).toBe(true);
  });

  it('identifica marca desde descripcion (token)', () => {
    const input = { rawRow: { description: 'Parlante JBL 305P MKII' } };
    const parsedInput = BrandIdentificationRequestSchema.parse(input);
    const result = identifyBrandFromRow(parsedInput.rawRow);
    const parsed = BrandIdentificationResultSchema.parse(result);
    expect(parsed.brand).toBe('JBL');
    expect(parsed.method).toBe('token');
    expect(parsed.confidence >= 0.5).toBe(true);
  });

  it('cuando no hay marca devuelve none', () => {
    const input = { rawRow: { description: 'Soporte microfono con boom' } };
    const parsedInput = BrandIdentificationRequestSchema.parse(input);
    const result = identifyBrandFromRow(parsedInput.rawRow);
    const parsed = BrandIdentificationResultSchema.parse(result);
    expect(parsed.brand).toBe(null);
    expect(parsed.method).toBe('none');
    expect(parsed.confidence).toBe(0);
  });
});
