const xlsx = require('xlsx');

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
  return xlsx.utils.sheet_to_json(sheet, { defval: '', raw: false });
}

module.exports = {
  parseTabularFile,
};
