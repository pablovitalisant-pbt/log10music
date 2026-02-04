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

const defaultDb: Db = { site_config: { header_code: '', footer_code: '' }, leads: [] };
let dbCache: Db | null = null;
let readInFlight: Promise<Db> | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function cloneDb(db: Db): Db {
  return JSON.parse(JSON.stringify(db)) as Db;
}

async function loadDbFromDisk(): Promise<Db> {
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(raw) as Db;
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'ENOENT') throw error;
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(defaultDb, null, 2), 'utf8');
    return cloneDb(defaultDb);
  }
}

async function readDb(): Promise<Db> {
  if (dbCache) return cloneDb(dbCache);
  if (!readInFlight) {
    readInFlight = loadDbFromDisk().then((db) => {
      dbCache = db;
      return db;
    });
  }
  const db = await readInFlight;
  readInFlight = null;
  return cloneDb(db);
}

function enqueueWrite(nextDb: Db): Promise<void> {
  dbCache = cloneDb(nextDb);
  writeQueue = writeQueue.then(() => fs.writeFile(dbPath, JSON.stringify(nextDb, null, 2), 'utf8'));
  return writeQueue;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const db = await readDb();
  return db.site_config;
}

export async function updateSiteConfig(config: SiteConfig): Promise<void> {
  const db = await readDb();
  db.site_config = config;
  await enqueueWrite(db);
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
  await enqueueWrite(db);
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  const db = await readDb();
  return db.leads;
}
