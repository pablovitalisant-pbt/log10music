import { useEffect, useRef, useState } from 'react';

type PublicCatalogItem = {
  id: string;
  model: string;
  brand?: string | null;
  available: boolean;
  imageUrl?: string | null;
  imageSource?: string | null;
};

type ProductCardProps = {
  item: PublicCatalogItem;
};

export default function ProductCard({ item }: ProductCardProps) {
  const [imageUrl, setImageUrl] = useState(item.imageUrl || null);
  const [imageSource, setImageSource] = useState(item.imageSource || null);
  const [hasFetched, setHasFetched] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);
  const imageMode =
    imageSource === 'logokit'
      ? 'object-contain bg-white/5 max-h-20 max-w-20'
      : 'object-cover';

  useEffect(() => {
    setImageUrl(item.imageUrl || null);
    setImageSource(item.imageSource || null);
    setHasFetched(false);
  }, [item.id, item.imageUrl, item.imageSource]);

  useEffect(() => {
    if (hasFetched) return;
    if (imageUrl && imageSource !== 'logokit') return;
    const element = cardRef.current;
    if (!element) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          const query = `${item.brand ? `${item.brand} ` : ''}${item.model}`.trim();
          if (!query) return;
          fetch(`/api/catalog/images?query=${encodeURIComponent(query)}&limit=1`, {
            cache: 'no-store',
          })
            .then((response) => response.json())
            .then((payload) => {
              const match = Array.isArray(payload?.items) ? payload.items[0] : null;
              if (match?.url) {
                setImageUrl(match.url);
                setImageSource(match.source || null);
              }
            })
            .catch(() => null)
            .finally(() => setHasFetched(true));
        });
      },
      { rootMargin: '200px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasFetched, imageUrl, imageSource, item.brand, item.model]);

  return (
    <article ref={cardRef} className="rounded border border-white/10 bg-industrial p-5 text-white">
      <div className="aspect-[4/3] overflow-hidden rounded bg-white/5 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.model}
            className={`h-full w-full ${imageMode}`}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase text-white/50">{item.brand || 'Sin marca'}</p>
        <h3 className="text-lg font-black">{item.model}</h3>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="rounded bg-primary/20 px-2 py-1 font-black text-primary">
            Disponible
          </span>
          <button className="rounded border border-white/20 px-3 py-1 font-black">
            Cotizar
          </button>
        </div>
      </div>
    </article>
  );
}
