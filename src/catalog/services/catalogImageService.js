const { normalizeTokens } = require('../extract/normalizers');

function normalizeKey(value) {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

function buildLogoKitUrl(brand, { token, size, fallback } = {}) {
  if (!brand || !token) return null;
  const domain = `${normalizeKey(brand)}.com`;
  if (!domain || domain === '.com') return null;
  const params = new URLSearchParams({ token });
  if (size) params.set('size', String(size));
  if (fallback) params.set('fallback', fallback);
  return `https://img.logokit.com/${domain}?${params.toString()}`;
}

function findMatchingProduct(query, products) {
  if (!Array.isArray(products) || products.length === 0) return null;
  const queryKey = normalizeKey(query);
  if (!queryKey) return null;
  return (
    products.find((product) => normalizeKey(product.model) === queryKey) ||
    products.find((product) => normalizeKey(`${product.brand || ''}${product.model}`) === queryKey) ||
    products.find((product) => normalizeKey(product.model).includes(queryKey))
  );
}

function buildCompactMlQuery(model, brand) {
  const normalizedModel = normalizeTokens(model || '');
  if (!normalizedModel) return brand || null;
  const stopwords = new Set([
    'linea',
    'microfono',
    'microfonos',
    'sistema',
    'set',
    'kit',
    'de',
    'del',
    'para',
    'con',
    'sin',
    'y',
    'un',
    'una',
    'par',
    'pack',
    'vocal',
    'instrumento',
    'inalambrico',
    'caja',
    'acustica',
    'activo',
    'pasiva',
    'sub',
    'bajo',
    'monitor',
    'estudio',
  ]);
  const tokens = normalizedModel.split(' ').filter(Boolean);
  const candidate = tokens.find((token) => {
    if (stopwords.has(token.toLowerCase())) return false;
    if (/^\d+$/.test(token)) return false;
    return token.length >= 2;
  });
  const compact = candidate || tokens.find((token) => token.length >= 2) || normalizedModel;
  if (brand) {
    return `${normalizeTokens(brand)} ${compact}`.trim();
  }
  return compact;
}

function normalizeTitle(value) {
  return normalizeTokens(value || '').toLowerCase();
}

function pickModelToken(model) {
  const normalized = normalizeTokens(model || '');
  if (!normalized) return null;
  const tokens = normalized.split(' ').filter(Boolean);
  const strong = tokens.find((token) => /[a-z]*\d+[a-z]*/i.test(token));
  return strong || tokens.find((token) => token.length >= 2) || normalized;
}

function extractAttributeValue(detail, keys) {
  const attributes = Array.isArray(detail?.attributes) ? detail.attributes : [];
  for (const attr of attributes) {
    const id = (attr?.id || '').toString().toLowerCase();
    const name = (attr?.name || '').toString().toLowerCase();
    if (keys.some((key) => id === key || name === key)) {
      return attr?.value_name || attr?.value || null;
    }
  }
  return null;
}

function matchesExpectedTitle({ title, model, brand, detail }) {
  const normalizedTitle = normalizeTitle(title);
  if (!normalizedTitle) return false;
  const titleKey = normalizeKey(title);
  const modelToken = pickModelToken(model);
  const modelKey = normalizeKey(modelToken || model || '');
  const brandKey = normalizeKey(brand || '');

  const attrBrand = normalizeKey(
    extractAttributeValue(detail, ['brand', 'marca']) || ''
  );
  const attrModel = normalizeKey(
    extractAttributeValue(detail, ['model', 'modelo']) || ''
  );

  const modelMatch =
    (modelKey && titleKey.includes(modelKey)) ||
    (modelKey && attrModel && attrModel.includes(modelKey));
  const brandMatch =
    !brandKey ||
    (brandKey && titleKey.includes(brandKey)) ||
    (brandKey && attrBrand && attrBrand.includes(brandKey));

  return Boolean(modelMatch && brandMatch);
}

function inferExpectedFromQuery(query) {
  const normalized = normalizeTokens(query || '');
  if (!normalized) return { model: null, brand: null };
  const tokens = normalized.split(' ').filter(Boolean);
  if (tokens.length >= 2) {
    return {
      brand: tokens[0],
      model: tokens.slice(1).join(' '),
    };
  }
  return { brand: null, model: normalized };
}

async function searchCatalogImages({
  query,
  limit,
  catalogProductRepo,
  accessToken,
  productImageRepo,
} = {}) {
  const trimmed = (query || '').trim();
  if (!trimmed) return [];
  const resolvedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(5, limit)) : 1;
  const searchLimit = Math.max(resolvedLimit, 20);
  const now = new Date().toISOString();
  const products = catalogProductRepo ? await catalogProductRepo.listCatalogProducts() : [];
  const matchedProduct = findMatchingProduct(trimmed, products);
  const inferred = inferExpectedFromQuery(trimmed);
  const expectedBrand = matchedProduct?.brand || inferred.brand;
  const expectedModel = matchedProduct?.model || inferred.model;
  if (matchedProduct && productImageRepo) {
    const override = await productImageRepo.getApprovedOverride(matchedProduct.id);
    if (override?.imageUrl) {
      return [
        {
          url: override.imageUrl,
          source: override.source || 'manual',
          updatedAt: override.updatedAt || now,
        },
      ].slice(0, resolvedLimit);
    }
  }
  if (matchedProduct?.imageUrl) {
    return [
      {
        url: matchedProduct.imageUrl,
        source: matchedProduct.imageSource || 'cache',
        updatedAt: matchedProduct.imageUpdatedAt || now,
      },
    ].slice(0, resolvedLimit);
  }

  const siteId = (process.env.ML_SITE_ID || 'MLC').toString().trim();
  const mlAccessToken = (accessToken || process.env.ML_ACCESS_TOKEN || '').trim();
  const queryCandidates = [
    matchedProduct?.brand && matchedProduct?.model
      ? `${matchedProduct.brand} ${matchedProduct.model}`
      : null,
    matchedProduct?.model ? buildCompactMlQuery(matchedProduct.model, matchedProduct.brand) : null,
    matchedProduct?.model || null,
    matchedProduct?.brand || null,
    trimmed,
  ].filter(Boolean);

  const mlHeaders = {
    'User-Agent': 'log10music/1.0 (+https://log10music.vercel.app)',
    Accept: 'application/json',
  };
  if (mlAccessToken) {
    mlHeaders.Authorization = `Bearer ${mlAccessToken}`;
  }

  function resolveMlImageFromResult(result) {
    const thumbnailId = result?.thumbnail_id;
    if (typeof thumbnailId === 'string' && thumbnailId.trim()) {
      return `https://http2.mlstatic.com/D_${thumbnailId.trim()}-O.jpg`;
    }
    return result?.thumbnail || null;
  }

  try {
    for (const candidate of queryCandidates) {
      if (!candidate) continue;
      const url = `https://api.mercadolibre.com/sites/${encodeURIComponent(
        siteId
      )}/search?q=${encodeURIComponent(candidate.slice(0, 80))}&limit=${searchLimit}`;
      const response = await fetch(url, { method: 'GET', headers: mlHeaders });
      if (!response.ok) continue;
      const payload = await response.json();
      const results = Array.isArray(payload?.results) ? payload.results : [];
      if (!results.length) continue;
      const items = [];
      for (const result of results) {
        if (items.length >= resolvedLimit) break;
        const id = result?.id;
        let imageUrl = resolveMlImageFromResult(result);
        if (id) {
          try {
            const detailResponse = await fetch(`https://api.mercadolibre.com/items/${id}`, {
              method: 'GET',
              headers: mlHeaders,
            });
            if (detailResponse.ok) {
              const detail = await detailResponse.json();
              const title = detail?.title || result?.title || '';
              if (
                (expectedBrand || expectedModel) &&
                !matchesExpectedTitle({
                  title,
                  model: expectedModel,
                  brand: expectedBrand,
                  detail,
                })
              ) {
                continue;
              }
              const pictures = Array.isArray(detail?.pictures) ? detail.pictures : [];
              const pictureUrl = pictures[0]?.url;
              if (typeof pictureUrl === 'string' && pictureUrl.startsWith('http')) {
                imageUrl = pictureUrl;
              }
            }
          } catch (_error) {
            // ignore and fall back to thumbnail
          }
        }
        if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
          items.push({ url: imageUrl, source: 'ml', updatedAt: now });
        }
      }
      if (items.length > 0 && matchedProduct && catalogProductRepo) {
        await catalogProductRepo.upsertCatalogProduct({
          id: matchedProduct.id,
          model: matchedProduct.model,
          brand: matchedProduct.brand || null,
          available: matchedProduct.available,
          updatedAt: matchedProduct.updatedAt || now,
          imageUrl: items[0].url,
          imageSource: 'ml',
          imageUpdatedAt: now,
        });
      }
      if (items.length > 0) return items;
    }
  } catch (_error) {
    // ignore and fall back
  }

  try {
    for (const candidate of queryCandidates) {
      if (!candidate) continue;
      const url = `https://api.mercadolibre.com/products/search?site_id=${encodeURIComponent(
        siteId
      )}&q=${encodeURIComponent(candidate.slice(0, 80))}&limit=${searchLimit}`;
      const response = await fetch(url, { method: 'GET', headers: mlHeaders });
      if (!response.ok) continue;
      const payload = await response.json();
      const rawResults = Array.isArray(payload?.results) ? payload.results : [];
      if (!rawResults.length) continue;
      const productIds = rawResults
        .map((entry) => {
          if (typeof entry === 'string') return entry;
          if (entry && typeof entry.id === 'string') return entry.id;
          if (entry && typeof entry.product_id === 'string') return entry.product_id;
          return null;
        })
        .filter(Boolean);
      if (!productIds.length) continue;
      const items = [];
      for (const productId of productIds) {
        if (items.length >= resolvedLimit) break;
        try {
          const detailResponse = await fetch(
            `https://api.mercadolibre.com/products/${productId}`,
            {
              method: 'GET',
              headers: mlHeaders,
            }
          );
          if (!detailResponse.ok) continue;
          const detail = await detailResponse.json();
          const title = detail?.name || detail?.title || '';
          if (
            (expectedBrand || expectedModel) &&
            !matchesExpectedTitle({
              title,
              model: expectedModel,
              brand: expectedBrand,
              detail,
            })
          ) {
            continue;
          }
          const pictures = Array.isArray(detail?.pictures) ? detail.pictures : [];
          const pictureUrl = pictures[0]?.url || detail?.thumbnail;
          if (typeof pictureUrl === 'string' && pictureUrl.startsWith('http')) {
            items.push({ url: pictureUrl, source: 'ml', updatedAt: now });
          }
        } catch (_error) {
          // ignore and keep trying next product
        }
      }
      if (items.length > 0 && matchedProduct && catalogProductRepo) {
        await catalogProductRepo.upsertCatalogProduct({
          id: matchedProduct.id,
          model: matchedProduct.model,
          brand: matchedProduct.brand || null,
          available: matchedProduct.available,
          updatedAt: matchedProduct.updatedAt || now,
          imageUrl: items[0].url,
          imageSource: 'ml',
          imageUpdatedAt: now,
        });
      }
      if (items.length > 0) return items;
    }
  } catch (_error) {
    // ignore and fall back
  }

  const logoToken = (process.env.LOGOKIT_PUBLISHABLE_TOKEN || '').trim();
  const fallback = (process.env.LOGOKIT_FALLBACK || 'monogram').trim();
  const size = process.env.LOGOKIT_SIZE ? Number(process.env.LOGOKIT_SIZE) : undefined;
  const brand =
    matchedProduct?.brand ||
    normalizeTokens(trimmed).split(' ').find((token) => token.length >= 2) ||
    null;
  const logoUrl = buildLogoKitUrl(brand, { token: logoToken, size, fallback });
  if (!logoUrl) return [];
  const logoItem = { url: logoUrl, source: 'logokit', updatedAt: now };
  if (matchedProduct && catalogProductRepo) {
    await catalogProductRepo.upsertCatalogProduct({
      id: matchedProduct.id,
      model: matchedProduct.model,
      brand: matchedProduct.brand || null,
      available: matchedProduct.available,
      updatedAt: matchedProduct.updatedAt || now,
      imageUrl: logoItem.url,
      imageSource: 'logokit',
      imageUpdatedAt: now,
    });
  }
  return [logoItem].slice(0, resolvedLimit);
}

module.exports = {
  searchCatalogImages,
};
