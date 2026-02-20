function normalizeHeaderValue(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
}

const STOCK_HEADERS = [
  'stock',
  'saldo',
  'disponible',
  'exist',
  'existencia',
  'qty',
  'cantidad',
  'disponibilidad',
];

function inferStockColumn(headers) {
  if (!Array.isArray(headers)) return null;
  for (let i = 0; i < headers.length; i += 1) {
    const normalized = normalizeHeaderValue(headers[i] || '');
    if (STOCK_HEADERS.some((keyword) => normalized.includes(keyword))) {
      return i;
    }
  }
  return null;
}

function parseStockValue(value) {
  if (value === null || value === undefined) return null;
  const raw = value.toString().trim();
  if (!raw) return null;
  const normalized = raw.replace(/[^0-9,.-]/g, '').replace(',', '.');
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) return null;
  return parsed;
}

module.exports = {
  inferStockColumn,
  parseStockValue,
};
