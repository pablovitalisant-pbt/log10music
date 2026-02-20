function normalizeHeaderValue(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
}

const HEADER_KEYWORDS = [
  'producto',
  'descripcion',
  'desc',
  'modelo',
  'model',
  'marca',
  'brand',
  'stock',
  'saldo',
  'disponible',
  'exist',
  'existencia',
  'cantidad',
  'qty',
  'codigo',
  'cod',
  'sku',
];

function detectHeaderRow(rows) {
  if (!Array.isArray(rows)) return -1;
  let bestIndex = -1;
  let bestScore = 0;
  const maxScan = Math.min(rows.length, 10);
  for (let i = 0; i < maxScan; i += 1) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    const normalized = row.map((cell) => normalizeHeaderValue(cell || ''));
    const score = normalized.reduce(
      (acc, cell) => (HEADER_KEYWORDS.some((keyword) => cell.includes(keyword)) ? acc + 1 : acc),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  return bestScore > 0 ? bestIndex : -1;
}

module.exports = {
  detectHeaderRow,
};
