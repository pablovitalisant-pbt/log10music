import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SiteConfig = { header_code: string; footer_code: string };
type Lead = {
  id: string;
  full_name: string;
  company: string;
  phone: string;
  source: string;
  created_at: string;
};

const defaultSiteConfig: SiteConfig = { header_code: '', footer_code: '' };

let clientCache: SupabaseClient | null = null;
let envLogged = false;

function mask(value: string): string {
  if (value.length <= 10) return `${value.slice(0, 3)}***`;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function getSupabaseClient(): SupabaseClient {
  if (clientCache) return clientCache;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = supabaseServiceRoleKey || supabaseAnonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment.');
  }
  if (!token) {
    throw new Error('Missing Supabase auth token. Set SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY).');
  }

  if (process.env.NODE_ENV !== 'production' && !envLogged) {
    console.log(
      `[supabase] env loaded url=${mask(supabaseUrl)} anon=${mask(supabaseAnonKey)} serviceRole=${
        supabaseServiceRoleKey ? 'present' : 'absent'
      }`
    );
    envLogged = true;
  }

  clientCache = createClient(supabaseUrl, token, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return clientCache;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('site_config')
    .select('header_code, footer_code')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw new Error(`Supabase getSiteConfig failed: ${error.message}`);
  if (!data) {
    await updateSiteConfig(defaultSiteConfig);
    return defaultSiteConfig;
  }
  return { header_code: data.header_code || '', footer_code: data.footer_code || '' };
}

export async function updateSiteConfig(config: SiteConfig): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('site_config').upsert(
    {
      id: 1,
      header_code: config.header_code || '',
      footer_code: config.footer_code || '',
    },
    { onConflict: 'id' }
  );
  if (error) throw new Error(`Supabase updateSiteConfig failed: ${error.message}`);
}

export async function addLead(input: {
  full_name: string;
  company: string;
  phone: string;
  source?: string;
}): Promise<Lead> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('leads')
    .insert({
      full_name: input.full_name,
      company: input.company,
      phone: input.phone,
      source: input.source || '/',
    })
    .select('id, full_name, company, phone, source, created_at')
    .single();
  if (error) throw new Error(`Supabase addLead failed: ${error.message}`);
  return data as Lead;
}

export async function listLeads(): Promise<Lead[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('leads')
    .select('id, full_name, company, phone, source, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Supabase listLeads failed: ${error.message}`);
  return (data || []) as Lead[];
}
