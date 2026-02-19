'use client';

import { useState } from 'react';

type ProductEditorProps = {
  productId: string;
  initialPrice?: string;
  initialPublished?: boolean;
};

export default function ProductEditor({
  productId,
  initialPrice = '',
  initialPublished = true,
}: ProductEditorProps) {
  const [price, setPrice] = useState(initialPrice);
  const [published, setPublished] = useState(initialPublished);
  const [saved, setSaved] = useState(false);

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
    </div>
  );
}
