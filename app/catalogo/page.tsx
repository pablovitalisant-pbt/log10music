import { headers } from 'next/headers';
import CatalogGrid from '../../components/CatalogGrid';
import { hydrateCatalogImages } from '../../src/catalog/publicCatalogImages';

export const metadata = {
  title: 'Catálogo Log10Music',
  description: 'Catálogo público de audio profesional disponible en Log10Music.',
};

async function resolveBaseUrl() {
  const host = (await headers()).get('host');
  if (!host) return 'http://localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export default async function CatalogoPage() {
  const baseUrl = await resolveBaseUrl();
  const data = await hydrateCatalogImages({ baseUrl });

  return (
    <main className="min-h-screen bg-charcoal px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase text-white/60">Catálogo público</p>
          <h1 className="text-4xl font-black">Audio profesional disponible</h1>
          <p className="text-white/70">
            Productos listos para cotizar, con disponibilidad real y respaldo técnico.
          </p>
        </header>
        <CatalogGrid items={data.items} />
      </div>
    </main>
  );
}
