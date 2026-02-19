function normalizeTokens(value) {
  if (!value && value !== 0) return '';
  return String(value)
    .replace(/[^\w\s-]/g, ' ')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = {
  normalizeTokens,
};
