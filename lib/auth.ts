export const ADMIN_COOKIE_NAME = 'admin_session';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'admin123';
}

export function getAdminToken(): string {
  return 'ok';
}
