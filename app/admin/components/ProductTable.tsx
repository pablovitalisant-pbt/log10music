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
  sourcesAvailable: CatalogSource[];
  updatedAt: string;
};

import ProductRow from './ProductRow';

type ProductTableProps = {
  products: CatalogProduct[];
};

export default function ProductTable({ products }: ProductTableProps) {
  if (!products.length) {
    return (
      <div className="rounded border border-white/10 bg-industrial p-6 text-white/60">
        No hay productos disponibles todavía.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-white/10 bg-industrial">
      <table className="min-w-full text-left">
        <thead className="border-b border-white/20 text-xs uppercase">
          <tr>
            <th className="p-3">Imagen</th>
            <th className="p-3">Producto</th>
            <th className="p-3">Marca</th>
            <th className="p-3">Proveedor</th>
            <th className="p-3">Precio</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Estado</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
