const { createClient } = require('@supabase/supabase-js');

let clientCache = null;

function getSupabaseClient() {
  if (clientCache) return clientCache;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = supabaseServiceRoleKey || supabaseAnonKey;

  if (!supabaseUrl || !token) {
    throw new Error('Missing SUPABASE_URL or Supabase key in environment.');
  }

  clientCache = createClient(supabaseUrl, token, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return clientCache;
}

module.exports = {
  getSupabaseClient,
};
