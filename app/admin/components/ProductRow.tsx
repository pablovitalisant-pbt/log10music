'use client';

import { useState } from 'react';
import ProductEditor from './ProductEditor';

type CatalogSource = {
  vendorId: string;
  vendorName?: string | null;
  fileId: string;
  fileName?: string | null;
};

type CatalogProduct = {
  id: string;
  model: string;
  brand?: string | null;
  available: boolean;
  imageUrl?: string | null;
  imageSource?: string | null;
  imageUpdatedAt?: string | null;
  sourcesAvailable: CatalogSource[];
  updatedAt: string;
};

type ProductRowProps = {
  product: CatalogProduct;
};

export default function ProductRow({ product }: ProductRowProps) {
  const [openEditor, setOpenEditor] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || null);
  const [imageSource, setImageSource] = useState(product.imageSource || null);
  const [approvalPending, setApprovalPending] = useState(false);
  const isApprovedImage = imageSource === 'manual' || imageSource === 'ml';
  const statusLabel = product.available ? 'Publicado' : 'Oculto';
  const vendorName = product.sourcesAvailable[0]?.vendorName || 'Importadora';
  const imageMode =
    imageSource === 'logokit'
      ? 'object-contain bg-white/5 max-h-8 max-w-8'
      : 'object-cover';

  async function toggleApproval() {
    if (approvalPending) return;
    setApprovalPending(true);
    try {
      const response = await fetch('/api/catalog/images/approval', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          approved: !isApprovedImage,
        }),
      });
      if (!response.ok) {
        setApprovalPending(false);
        return;
      }
      if (!isApprovedImage) {
        setImageSource(imageSource || 'manual');
      } else {
        setImageSource(null);
        setImageUrl(null);
      }
    } catch (_error) {
      // ignore
    } finally {
      setApprovalPending(false);
    }
  }

  return (
    <>
      <tr className="border-b border-white/10 text-sm">
        <td className="p-3">
          <div className="flex items-center gap-2">
            <span
              role="button"
              tabIndex={0}
              onClick={toggleApproval}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  toggleApproval();
                }
              }}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                isApprovedImage ? 'bg-emerald-400' : 'bg-red-400'
              } ${approvalPending ? 'opacity-50' : ''}`}
              title={
                isApprovedImage
                  ? 'Imagen aprobada (click para desactivar)'
                  : 'Imagen sin aprobar (click para aprobar)'
              }
            />
            <div className="size-10 overflow-hidden rounded bg-white/5 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.model}
                className={`h-full w-full ${imageMode}`}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full" />
            )}
            </div>
          </div>
        </td>
        <td className="p-3">
          <div className="font-black">{product.model}</div>
          <div className="text-xs text-white/50">SKU: {product.id}</div>
        </td>
        <td className="p-3">{product.brand || 'Sin marca'}</td>
        <td className="p-3">{vendorName}</td>
        <td className="p-3">--</td>
        <td className="p-3">--</td>
        <td className="p-3">
          <span className="rounded bg-white/10 px-2 py-1 text-xs font-black">
            {statusLabel}
          </span>
        </td>
        <td className="p-3 text-right">
          <button
            type="button"
            onClick={() => setOpenEditor((value) => !value)}
            className="rounded border border-white/20 px-3 py-1 text-xs font-black"
          >
            Editar
          </button>
        </td>
      </tr>
      {openEditor ? (
        <tr className="border-b border-white/10">
          <td colSpan={8} className="p-3">
            <ProductEditor
              productId={product.id}
              model={product.model}
              brand={product.brand}
              imageUrl={imageUrl || null}
              initialPublished={product.available}
              onImageSaved={(url, source) => {
                setImageUrl(url);
                setImageSource(source || null);
              }}
            />
          </td>
        </tr>
      ) : null}
    </>
  );
}
