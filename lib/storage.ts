import { promises as fs } from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

type SiteConfig = { header_code: string; footer_code: string };
type Lead = {
  id: string;
  full_name: string;
  company: string;
  phone: string;
  source: string;
  created_at: string;
};

type Db = { site_config: SiteConfig; leads: Lead[] };

async function readDb(): Promise<Db> {
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw) as Db;
}

async function writeDb(db: Db): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const db = await readDb();
  return db.site_config;
}

export async function updateSiteConfig(config: SiteConfig): Promise<void> {
  const db = await readDb();
  db.site_config = config;
  await writeDb(db);
}

export async function addLead(input: {
  full_name: string;
  company: string;
  phone: string;
  source?: string;
}): Promise<Lead> {
  const db = await readDb();
  const lead: Lead = {
    id: crypto.randomUUID(),
    full_name: input.full_name,
    company: input.company,
    phone: input.phone,
    source: input.source || '/',
    created_at: new Date().toISOString(),
  };
  db.leads.unshift(lead);
  await writeDb(db);
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  const db = await readDb();
  return db.leads;
}
