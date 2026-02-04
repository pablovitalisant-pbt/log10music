import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, getAdminToken } from '../../lib/auth';
import { getSiteConfig, listLeads } from '../../lib/storage';

export const dynamic = 'force-dynamic';

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
  const isAdmin = cookies().get(ADMIN_COOKIE_NAME)?.value === getAdminToken();
  if (!isAdmin) return <LoginView />;

  const [leads, config] = await Promise.all([listLeads(), getSiteConfig()]);

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
