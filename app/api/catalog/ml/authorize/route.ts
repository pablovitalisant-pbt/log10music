import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, getAdminToken } from '../../../../lib/auth';

function resolveBaseUrl(request: Request): string {
  const header = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  if (header) return `${protocol}://${header}`;
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://log10music.vercel.app';
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === getAdminToken();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const clientId = (process.env.ML_CLIENT_ID || '').trim();
  if (!clientId) {
    return NextResponse.json({ error: 'Missing ML_CLIENT_ID' }, { status: 500 });
  }
  const baseUrl = resolveBaseUrl(request);
  const redirectUri = `${baseUrl}/api/catalog/ml/callback`;
  const state = Math.random().toString(36).slice(2);
  const authUrl = new URL('https://auth.mercadolibre.com/authorization');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  return NextResponse.redirect(authUrl.toString());
}
