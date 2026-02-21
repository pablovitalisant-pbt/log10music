'use client';

import { useState } from 'react';

type ProductEditorProps = {
  productId: string;
  model: string;
  brand?: string | null;
  imageUrl?: string | null;
  initialPrice?: string;
  initialPublished?: boolean;
  onImageSaved?: (url: string, source?: string | null) => void;
};

export default function ProductEditor({
  productId,
  model,
  brand,
  imageUrl,
  initialPrice = '',
  initialPublished = true,
  onImageSaved,
}: ProductEditorProps) {
  const [price, setPrice] = useState(initialPrice);
  const [published, setPublished] = useState(initialPublished);
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState(
    `${brand ? `${brand} ` : ''}${model}`.trim()
  );
  const [results, setResults] = useState<Array<{ url: string; source: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [imageMessage, setImageMessage] = useState<string | null>(null);

  async function handleSearchImages() {
    if (!query.trim()) return;
    setLoading(true);
    setImageMessage(null);
    try {
      const response = await fetch(
        `/api/catalog/images?query=${encodeURIComponent(query.trim())}&limit=5`
      );
      const payload = await response.json();
      setResults(Array.isArray(payload?.items) ? payload.items : []);
      if (!payload?.items?.length) {
        setImageMessage('No se encontraron resultados.');
      }
    } catch (error) {
      setImageMessage('No se pudo buscar imagenes.');
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyImage(url: string, source: string, usedQuery?: string) {
    if (!url || !url.trim()) {
      setImageMessage('Ingresa una URL valida.');
      return;
    }
    setImageMessage(null);
    try {
      const response = await fetch('/api/catalog/images/override', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          productId,
          imageUrl: url,
          source: source || 'manual',
          query: usedQuery || query,
        }),
      });
      if (!response.ok) {
        const payload = await response.json();
        setImageMessage(payload?.error || 'No se pudo guardar la imagen.');
        return;
      }
      onImageSaved?.(url, source);
      setImageMessage('Imagen guardada.');
    } catch (_error) {
      setImageMessage('No se pudo guardar la imagen.');
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-white/10 bg-charcoal/40 p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-xs font-black uppercase text-white/60">
          Precio
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Precio"
            className="mt-2 w-full rounded border border-white/20 bg-charcoal px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs font-black uppercase text-white/60">
          Publicación
          <select
            value={published ? 'publicado' : 'oculto'}
            onChange={(event) => setPublished(event.target.value === 'publicado')}
            className="mt-2 w-full rounded border border-white/20 bg-charcoal px-3 py-2 text-sm"
          >
            <option value="publicado">Publicado</option>
            <option value="oculto">Oculto</option>
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="rounded bg-primary px-4 py-2 text-xs font-black text-charcoal"
          >
            Guardar
          </button>
          {saved ? (
            <span className="text-xs font-black text-emerald-400">Guardado local</span>
          ) : null}
        </div>
      </div>
      <p className="mt-2 text-[10px] text-white/40">
        Producto: {productId}
      </p>
      <div className="mt-4 border-t border-white/10 pt-4">
        <h3 className="text-xs font-black uppercase text-white/60">Imagen</h3>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end">
          <label className="flex-1 text-xs font-black uppercase text-white/60">
            Buscar
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Marca + modelo"
              className="mt-2 w-full rounded border border-white/20 bg-charcoal px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={handleSearchImages}
            className="rounded border border-white/30 px-4 py-2 text-xs font-black"
          >
            {loading ? 'Buscando...' : 'Buscar imagen'}
          </button>
        </div>
        {imageMessage ? (
          <p className="mt-2 text-xs text-amber-200">{imageMessage}</p>
        ) : null}
        {imageUrl ? (
          <div className="mt-3 flex items-center gap-3 text-xs text-white/60">
            <div className="size-12 overflow-hidden rounded bg-white/5">
              <img src={imageUrl} alt="Imagen actual" className="h-full w-full object-cover" />
            </div>
            <span>Imagen actual</span>
          </div>
        ) : null}
        {results.length ? (
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {results.map((result) => (
              <button
                key={result.url}
                type="button"
                onClick={() => handleApplyImage(result.url, result.source, query)}
                className="flex flex-col items-start gap-2 rounded border border-white/10 bg-charcoal/60 p-2 text-left text-xs"
              >
                <div className="h-24 w-full overflow-hidden rounded bg-white/5">
                  <img src={result.url} alt="Resultado" className="h-full w-full object-cover" />
                </div>
                <span className="text-white/60">Fuente: {result.source}</span>
                <span className="text-emerald-300">Usar esta</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-end">
          <label className="flex-1 text-xs font-black uppercase text-white/60">
            URL manual
            <input
              value={manualUrl}
              onChange={(event) => setManualUrl(event.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded border border-white/20 bg-charcoal px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={() => handleApplyImage(manualUrl, 'manual', query)}
            className="rounded border border-white/30 px-4 py-2 text-xs font-black"
          >
            Guardar URL
          </button>
        </div>
      </div>
    </div>
  );
}
