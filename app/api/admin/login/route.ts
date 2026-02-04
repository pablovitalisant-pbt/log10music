import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, getAdminPassword, getAdminToken } from '../../../../lib/auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get('password') || '');
  if (password !== getAdminPassword()) {
    return NextResponse.redirect(new URL('/admin?error=1', request.url));
  }
  const response = NextResponse.redirect(new URL('/admin', request.url));
  response.cookies.set(ADMIN_COOKIE_NAME, getAdminToken(), { httpOnly: true, sameSite: 'lax', path: '/' });
  return response;
}
