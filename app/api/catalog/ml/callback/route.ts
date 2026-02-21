import { NextResponse } from 'next/server';
import { upsertIntegration } from '../../../../../src/catalog/persistence/catalogDb';

function resolveBaseUrl(request: Request): string {
  const header = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  if (header) return `${protocol}://${header}`;
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://log10music.vercel.app';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }
  const clientId = (process.env.ML_CLIENT_ID || '').trim();
  const clientSecret = (process.env.ML_CLIENT_SECRET || '').trim();
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing ML credentials' }, { status: 500 });
  }
  const baseUrl = resolveBaseUrl(request);
  const redirectUri = `${baseUrl}/api/catalog/ml/callback`;

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
  });

  const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  const payload = await tokenResponse.json();
  if (!tokenResponse.ok) {
    return NextResponse.json({ error: payload?.message || 'ML token error', detail: payload }, { status: 400 });
  }

  const now = Date.now();
  const expiresIn = Number(payload.expires_in || 0);
  const record = {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    token_type: payload.token_type,
    expires_in: expiresIn,
    expires_at: expiresIn ? now + expiresIn * 1000 : null,
    user_id: payload.user_id,
    scope: payload.scope,
    obtained_at: now,
  };

  await upsertIntegration('mercadolibre', record);

  const redirect = new URL('/admin?ml=connected', baseUrl);
  return NextResponse.redirect(redirect.toString());
}
