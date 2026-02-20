async function searchCatalogImages({ query, limit } = {}) {
  const trimmed = (query || '').trim();
  if (!trimmed) return [];
  const resolvedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(5, limit)) : 1;
  const siteId = (process.env.ML_SITE_ID || 'MLC').toString().trim();
  const url = `https://api.mercadolibre.com/sites/${encodeURIComponent(
    siteId
  )}/search?q=${encodeURIComponent(trimmed)}&limit=${resolvedLimit}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) return [];
    const payload = await response.json();
    const results = Array.isArray(payload?.results) ? payload.results : [];
    const now = new Date().toISOString();
    return results
      .map((item) => item?.thumbnail)
      .filter((thumbnail) => typeof thumbnail === 'string' && thumbnail.startsWith('http'))
      .map((thumbnail) => ({
        url: thumbnail,
        source: 'ml',
        updatedAt: now,
      }))
      .slice(0, resolvedLimit);
  } catch (_error) {
    return [];
  }
}

module.exports = {
  searchCatalogImages,
};
