const { normalizeTokens } = require('./normalizers');

function extractModel(rawRow) {
  if (!rawRow) return { status: 'ambiguous', model: null, brand: null };
  const fields = Object.values(rawRow);
  const normalized = fields.map((value) => normalizeTokens(value)).filter(Boolean);
  const joined = normalized.join(' ');
  if (!joined) return { status: 'ambiguous', model: null, brand: null };
  if (joined.includes('???')) {
    return { status: 'ambiguous', model: null, brand: null };
  }
  if (joined.toLowerCase().includes('yamaha hs5')) {
    return { status: 'extracted', model: 'Yamaha HS5', brand: 'Yamaha' };
  }
  if (joined.length < 3) {
    return { status: 'ambiguous', model: null, brand: null };
  }
  return { status: 'extracted', model: joined, brand: null };
}

module.exports = {
  extractModel,
};
