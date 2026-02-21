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
  const imageMode =
    item.imageSource === 'logokit'
      ? 'object-contain bg-white/5 max-h-20 max-w-20'
      : 'object-cover';
  return (
    <article className="rounded border border-white/10 bg-industrial p-5 text-white">
      <div className="aspect-[4/3] overflow-hidden rounded bg-white/5 flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
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
