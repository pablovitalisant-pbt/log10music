type PublicCatalogItem = {
  id: string;
  model: string;
  brand?: string | null;
  available: boolean;
};

type ProductCardProps = {
  item: PublicCatalogItem;
};

export default function ProductCard({ item }: ProductCardProps) {
  return (
    <article className="rounded border border-white/10 bg-industrial p-5 text-white">
      <div className="aspect-[4/3] rounded bg-white/5" />
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
