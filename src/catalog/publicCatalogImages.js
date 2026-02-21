const { fetchPublicCatalog } = require('./publicCatalogClient');

async function hydrateCatalogImages({ baseUrl } = {}) {
  const payload = await fetchPublicCatalog({ baseUrl });
  if (!baseUrl || typeof fetch !== 'function') return payload;
  const items = await Promise.all(
    payload.items.map(async (item) => {
      if (item.imageUrl || !item.model) return item;
      const query = encodeURIComponent(item.model);
      const response = await fetch(`${baseUrl}/api/catalog/images?query=${query}&limit=1`, {
        cache: 'no-store',
      });
      if (!response.ok) return item;
      const data = await response.json();
      const match = Array.isArray(data?.items) ? data.items[0] : null;
      if (!match?.url) return item;
      return {
        ...item,
        imageUrl: match.url,
        imageSource: match.source,
        imageUpdatedAt: match.updatedAt,
      };
    })
  );
  return { ...payload, items };
}

module.exports = {
  hydrateCatalogImages,
};
