import { NextResponse } from 'next/server';
import { getIntegration } from '../../../../src/catalog/persistence/catalogDb';

export async function GET() {
  const record = await getIntegration('mercadolibre');
  if (!record) {
    return NextResponse.json({ connected: false });
  }
  const data = record.data || {};
  return NextResponse.json({
    connected: Boolean(data.access_token),
    expiresAt: data.expires_at || null,
    scope: data.scope || null,
    userId: data.user_id || null,
  });
}
