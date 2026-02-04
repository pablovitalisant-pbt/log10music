import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, getAdminToken } from '../../../lib/auth';
import { getSiteConfig, updateSiteConfig } from '../../../lib/storage';

export const runtime = 'nodejs';

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === getAdminToken();
}

export async function GET() {
  const siteConfig = await getSiteConfig();
  return NextResponse.json(siteConfig);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await request.json();
    await updateSiteConfig({ header_code: body.header_code || '', footer_code: body.footer_code || '' });
    return NextResponse.json({ ok: true });
  }
  const formData = await request.formData();
  await updateSiteConfig({
    header_code: String(formData.get('header_code') || ''),
    footer_code: String(formData.get('footer_code') || ''),
  });
  return NextResponse.redirect(new URL('/admin?saved=1', request.url));
}

export const PUT = POST;
