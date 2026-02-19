'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

type PublicCatalogItem = {
  id: string;
  model: string;
  brand?: string | null;
  available: boolean;
};

type CatalogGridProps = {
  items: PublicCatalogItem[];
};

export default function CatalogGrid({ items }: CatalogGridProps) {
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('');

  const brands = useMemo(() => {
    const set = new Set(items.map((item) => item.brand).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (brand && item.brand !== brand) return false;
      if (!needle) return true;
      return item.model.toLowerCase().includes(needle);
    });
  }, [items, brand, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar modelo"
          className="w-full rounded border border-white/20 bg-charcoal px-4 py-3 text-sm text-white"
        />
        <select
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          className="rounded border border-white/20 bg-charcoal px-4 py-3 text-sm text-white"
        >
          <option value="">Todas las marcas</option>
          {brands.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded border border-white/10 bg-industrial p-6 text-white/60">
          No hay productos disponibles para esta búsqueda.
        </div>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
