import { NextResponse } from 'next/server';
import { addLead, listLeads } from '../../../lib/storage';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.full_name || !body.company || !body.phone) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }
  const lead = await addLead(body);
  return NextResponse.json({ ok: true, lead });
}

export async function GET() {
  const leads = await listLeads();
  return NextResponse.json({ leads });
}
