import { headers } from 'next/headers';
import IncidenceTable from '../components/IncidenceTable';

type Issue = {
  issueId: string;
  type: string;
  vendorId: string;
  fileId: string;
  fileName: string;
  detail: Record<string, unknown>;
};

type IssuesResponse = {
  items: Issue[];
};

async function resolveBaseUrl() {
  const host = (await headers()).get('host');
  if (!host) return 'http://localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export default async function IncidenciasPage() {
  const baseUrl = await resolveBaseUrl();
  const response = await fetch(`${baseUrl}/api/catalog/issues`, { cache: 'no-store' });
  const data = (await response.json()) as IssuesResponse;

  return (
    <main className="min-h-screen bg-charcoal p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-white/60">Admin</p>
            <h1 className="text-3xl font-black">Incidencias</h1>
          </div>
          <a
            href="/admin"
            className="rounded border border-white/30 px-4 py-2 text-xs font-black"
          >
            Volver al panel
          </a>
        </div>
        <IncidenceTable issues={data.items || []} />
      </div>
    </main>
  );
}
