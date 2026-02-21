import { NextResponse } from 'next/server';
import { confirmLead } from '../../../../lib/storage';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body = null;
  try {
    body = await request.json();
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const id = body?.id;
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  await confirmLead(id);
  return NextResponse.json({ ok: true });
}
