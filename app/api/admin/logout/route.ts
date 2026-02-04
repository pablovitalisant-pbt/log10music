import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '../../../../lib/auth';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/admin', request.url));
  response.cookies.set(ADMIN_COOKIE_NAME, '', { httpOnly: true, expires: new Date(0), path: '/' });
  return response;
}
