import { cookies, headers } from 'next/headers';
import { ADMIN_COOKIE_NAME, getAdminToken } from '../../lib/auth';
import { getSiteConfig, listLeads } from '../../lib/storage';
import SyncButton from './components/SyncButton';

export const dynamic = 'force-dynamic';

type CatalogHealth = {
  status: 'ok' | 'degraded' | 'error';
  lastSyncAt: string | null;
  staleMinutes: number | null;
  issuesOpen: number;
  productsAvailable: number;
  reasonCodes: string[];
};

type CatalogMetrics = {
  windowHours: number;
  runsTotal: number;
  runsLast24h: number;
  issuesTotal: number;
  issuesAmbiguous: number;
  filesProcessedTotal: number;
  rowsParsedTotal: number;
};

async function resolveBaseUrl() {
  const host = (await headers()).get('host');
  if (!host) return 'http://localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

async function fetchCatalogHealth(baseUrl: string): Promise<CatalogHealth> {
  const response = await fetch(`${baseUrl}/api/catalog/health`, { cache: 'no-store' });
  return response.json();
}

async function fetchCatalogMetrics(baseUrl: string): Promise<CatalogMetrics> {
  const response = await fetch(`${baseUrl}/api/catalog/metrics`, { cache: 'no-store' });
  return response.json();
}

function LoginView() {
  return (
    <main className="min-h-screen bg-charcoal p-8 text-white">
      <div className="mx-auto mt-24 max-w-md border border-white/20 bg-industrial p-8">
        <h1 className="mb-6 text-3xl font-black">Admin Login</h1>
        <form action="/api/admin/login" method="post" className="space-y-4">
          <input
            name="password"
            type="password"
            required
            placeholder="ADMIN_PASSWORD"
            className="w-full border border-white/20 bg-charcoal p-3"
          />
          <button className="w-full bg-primary p-3 font-black text-charcoal">Ingresar</button>
        </form>
      </div>
    </main>
  );
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === getAdminToken();
  if (!isAdmin) return <LoginView />;

  const baseUrl = await resolveBaseUrl();
  let leads: Awaited<ReturnType<typeof listLeads>> = [];
  let config: Awaited<ReturnType<typeof getSiteConfig>> = { header_code: '', footer_code: '' };
  let health: CatalogHealth = {
    status: 'degraded',
    lastSyncAt: null,
    staleMinutes: null,
    issuesOpen: 0,
    productsAvailable: 0,
    reasonCodes: ['admin_data_error'],
  };
  let metrics: CatalogMetrics = {
    windowHours: 24,
    runsTotal: 0,
    runsLast24h: 0,
    issuesTotal: 0,
    issuesAmbiguous: 0,
    filesProcessedTotal: 0,
    rowsParsedTotal: 0,
  };
  try {
    [leads, config, health, metrics] = await Promise.all([
      listLeads(),
      getSiteConfig(),
      fetchCatalogHealth(baseUrl),
      fetchCatalogMetrics(baseUrl),
    ]);
  } catch (error) {
    console.error('[admin] failed to load data', error);
  }

  return (
    <main className="min-h-screen bg-charcoal p-8 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black">Panel Admin</h1>
          <form action="/api/admin/logout" method="post">
            <button className="border border-white/30 px-4 py-2 font-black">Salir</button>
          </form>
        </div>

        <section className="border border-white/20 bg-industrial p-6">
          <h2 className="mb-4 text-2xl font-black">Estado del Catálogo</h2>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="rounded border border-white/10 bg-charcoal p-4">
              <p className="text-xs uppercase text-white/50">Estado</p>
              <p className="text-xl font-black">{health.status}</p>
            </div>
            <div className="rounded border border-white/10 bg-charcoal p-4">
              <p className="text-xs uppercase text-white/50">Productos</p>
              <p className="text-xl font-black">{health.productsAvailable}</p>
            </div>
            <div className="rounded border border-white/10 bg-charcoal p-4">
              <p className="text-xs uppercase text-white/50">Incidencias</p>
              <p className="text-xl font-black">{health.issuesOpen}</p>
            </div>
            <div className="rounded border border-white/10 bg-charcoal p-4">
              <p className="text-xs uppercase text-white/50">Syncs (24h)</p>
              <p className="text-xl font-black">{metrics.runsLast24h}</p>
            </div>
            <div className="rounded border border-white/10 bg-charcoal p-4">
              <p className="text-xs uppercase text-white/50">Ambiguous</p>
              <p className="text-xl font-black">{metrics.issuesAmbiguous}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
            {health.reasonCodes.length ? (
              health.reasonCodes.map((code) => (
                <span key={code} className="rounded border border-white/10 px-2 py-1">
                  {code}
                </span>
              ))
            ) : (
              <span className="rounded border border-white/10 px-2 py-1">ok</span>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/admin/catalog" className="rounded bg-primary px-4 py-2 text-xs font-black text-charcoal">
              Ver productos
            </a>
            <a href="/admin/incidencias" className="rounded border border-white/30 px-4 py-2 text-xs font-black">
              Ver incidencias
            </a>
            <SyncButton />
          </div>
        </section>

        <section className="border border-white/20 bg-industrial p-6">
          <h2 className="mb-4 text-2xl font-black">Inyección de Scripts</h2>
          <form action="/api/config" method="post" className="space-y-4">
            <div>
              <label className="mb-2 block font-black">Header Code</label>
              <textarea
                name="header_code"
                defaultValue={config.header_code}
                className="h-40 w-full border border-white/20 bg-charcoal p-3 font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block font-black">Footer Code</label>
              <textarea
                name="footer_code"
                defaultValue={config.footer_code}
                className="h-40 w-full border border-white/20 bg-charcoal p-3 font-mono text-sm"
              />
            </div>
            <button className="bg-primary px-6 py-3 font-black text-charcoal">Guardar Scripts</button>
          </form>
        </section>

        <section className="border border-white/20 bg-industrial p-6">
          <h2 className="mb-4 text-2xl font-black">Leads Capturados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/20 font-black">
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Empresa</th>
                  <th className="p-2">WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/10">
                    <td className="p-2">{new Date(lead.created_at).toLocaleString('es-BO')}</td>
                    <td className="p-2">{lead.full_name}</td>
                    <td className="p-2">{lead.company}</td>
                    <td className="p-2">{lead.phone}</td>
                  </tr>
                ))}
                {leads.length === 0 ? (
                  <tr>
                    <td className="p-2 opacity-60" colSpan={4}>
                      Aún no hay leads.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
