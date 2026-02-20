const xlsx = require('xlsx');
const { detectHeaderRow } = require('./headerDetector');

function normalizeHeaderValue(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
}

const HEADER_MAP = [
  { key: 'stock', match: ['stock', 'saldo', 'disponible', 'exist', 'existencia', 'qty', 'cantidad'] },
  { key: 'brand', match: ['marca', 'brand'] },
  { key: 'model', match: ['modelo', 'model'] },
  { key: 'product', match: ['producto', 'product'] },
  { key: 'description', match: ['descripcion', 'description', 'desc'] },
  { key: 'code', match: ['codigo', 'cod', 'sku'] },
];

function mapHeaderToKey(header) {
  const normalized = normalizeHeaderValue(header);
  for (const mapping of HEADER_MAP) {
    if (mapping.match.some((keyword) => normalized.includes(keyword))) {
      return mapping.key;
    }
  }
  return null;
}

function parseTabularFile({ buffer, mimeType } = {}) {
  if (!buffer) return [];
  let workbook = null;
  if (mimeType === 'text/csv' || mimeType === 'application/vnd.ms-excel') {
    const text = buffer.toString('utf8');
    workbook = xlsx.read(text, { type: 'string' });
  } else {
    workbook = xlsx.read(buffer, { type: 'buffer' });
  }
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
  if (!Array.isArray(rows) || rows.length === 0) return [];
  const headerIndex = detectHeaderRow(rows);
  const headerRow = headerIndex >= 0 ? rows[headerIndex] : rows[0];
  const headerKeys = headerRow.map((cell) => mapHeaderToKey(cell) || normalizeHeaderValue(cell));
  const dataRows = rows.slice(headerIndex >= 0 ? headerIndex + 1 : 1);
  return dataRows
    .filter((row) => Array.isArray(row) && row.some((cell) => String(cell || '').trim()))
    .map((row) => {
      const mapped = {};
      row.forEach((cell, idx) => {
        const key = headerKeys[idx] || `col_${idx + 1}`;
        mapped[key] = cell;
      });
      return mapped;
    });
}

module.exports = {
  parseTabularFile,
};
