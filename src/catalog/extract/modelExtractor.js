const { normalizeTokens } = require('./normalizers');

const BRAND_TOKENS = [
  { token: 'yamaha', label: 'Yamaha' },
  { token: 'jbl', label: 'JBL' },
  { token: 'akg', label: 'AKG' },
  { token: 'mackie', label: 'Mackie' },
  { token: 'peavey', label: 'Peavey' },
  { token: 'dbx', label: 'DBX' },
  { token: 'crown', label: 'Crown' },
  { token: 'blaupunkt', label: 'Blaupunkt' },
  { token: 'novik', label: 'Novik' },
  { token: 'proel', label: 'Proel' },
  { token: 'skp', label: 'SKP' },
  { token: 'neutrik', label: 'Neutrik' },
  { token: 'rean', label: 'Rean' },
  { token: 'probass', label: 'Probass' },
  { token: 'digico', label: 'DiGiCo' },
];

const HEADER_LIKE = ['stock', 'precio', 'producto', 'marca', 'descripcion', 'codigo', 'unidad', 'packing'];

function normalizeForToken(value) {
  return value
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function extractBrandFromText(text) {
  const normalized = normalizeForToken(text);
  if (!normalized) return null;
  const match = BRAND_TOKENS.find((entry) =>
    normalized.includes(` ${entry.token} `) || normalized.startsWith(`${entry.token} `) || normalized.endsWith(` ${entry.token}`)
  );
  if (!match) return null;
  return match.label;
}

function identifyBrandFromRow(rawRow) {
  if (!rawRow || typeof rawRow !== 'object') {
    return { brand: null, confidence: 0, method: 'none' };
  }
  const headerBrand =
    rawRow.brand ||
    rawRow.marca ||
    rawRow.marca_producto ||
    rawRow.brand_name ||
    rawRow.marca_producto_nombre;
  if (headerBrand) {
    const normalized = normalizeTokens(headerBrand);
    if (normalized.length >= 2) {
      return { brand: normalized, confidence: 0.95, method: 'header' };
    }
  }
  const fields = Object.values(rawRow);
  const normalizedFields = fields.map((value) => normalizeTokens(value)).filter(Boolean);
  const joined = normalizedFields.join(' ');
  const tokenBrand = joined ? extractBrandFromText(joined) : null;
  if (tokenBrand) {
    return { brand: tokenBrand, confidence: 0.6, method: 'token' };
  }
  return { brand: null, confidence: 0, method: 'none' };
}

function isHeaderLike(modelCandidate) {
  const normalized = modelCandidate.toLowerCase();
  if (normalized === 'total' || normalized.startsWith('total ')) return true;
  if (HEADER_LIKE.some((token) => normalized.includes(token))) {
    const headerHits = HEADER_LIKE.reduce(
      (acc, token) => (normalized.includes(token) ? acc + 1 : acc),
      0
    );
    return headerHits >= 2;
  }
  return false;
}

function extractModel(rawRow) {
  if (!rawRow) return { status: 'ambiguous', model: null, brand: null };
  const brandResult = identifyBrandFromRow(rawRow);
  const modelValue =
    rawRow.model ||
    rawRow.modelo ||
    rawRow.product ||
    rawRow.producto ||
    rawRow.description ||
    rawRow.descripcion;

  const modelCandidate = normalizeTokens(modelValue || '');
  if (modelCandidate && isHeaderLike(modelCandidate)) {
    return { status: 'ambiguous', model: null, brand: null };
  }

  const fields = Object.values(rawRow);
  const normalizedFields = fields.map((value) => normalizeTokens(value)).filter(Boolean);
  const joined = modelCandidate || normalizedFields.join(' ');
  if (!joined) return { status: 'ambiguous', model: null, brand: null };
  if (joined.includes('???')) {
    return { status: 'ambiguous', model: null, brand: null };
  }
  if (joined.length < 3) {
    return { status: 'ambiguous', model: null, brand: null };
  }
  const brand = brandResult.brand || extractBrandFromText(joined) || extractBrandFromText(modelCandidate || '');
  return { status: 'extracted', model: joined, brand: brand || null };
}

module.exports = {
  extractModel,
  identifyBrandFromRow,
};
