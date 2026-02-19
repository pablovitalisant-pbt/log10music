import { headers } from 'next/headers';
import ProductTable from '../components/ProductTable';

type CatalogProduct = {
  id: string;
  model: string;
  brand?: string | null;
  available: boolean;
  sourcesAvailable: Array<{
    vendorId: string;
    vendorName?: string | null;
    fileId: string;
    fileName?: string | null;
  }>;
  updatedAt: string;
};

type CatalogProductsResponse = {
  items: CatalogProduct[];
};

function resolveBaseUrl() {
  const host = headers().get('host');
  if (!host) return 'http://localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export default async function CatalogAdminPage() {
  const baseUrl = resolveBaseUrl();
  const response = await fetch(`${baseUrl}/api/catalog/products`, { cache: 'no-store' });
  const data = (await response.json()) as CatalogProductsResponse;

  return (
    <main className="min-h-screen bg-charcoal p-8 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-white/60">Admin</p>
            <h1 className="text-3xl font-black">Productos</h1>
          </div>
          <a
            href="/admin"
            className="rounded border border-white/30 px-4 py-2 text-xs font-black"
          >
            Volver al panel
          </a>
        </div>
        <ProductTable products={data.items || []} />
      </div>
    </main>
  );
}
