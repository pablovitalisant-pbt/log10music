import { NextResponse } from 'next/server';
import { addLead, listLeads } from '../../../lib/storage';

export const runtime = 'nodejs';

function normalizePhone(input: string): string {
  return input.replace(/[^\d+]/g, '');
}

function isValidWhatsapp(phone: string): boolean {
  const normalized = normalizePhone(phone);
  const digits = normalized.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) return false;
  if (normalized.startsWith('+')) return true;
  return digits.length >= 9;
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.full_name || !body.company || !body.phone) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }
  if (!isValidWhatsapp(body.phone)) {
    return NextResponse.json({ error: 'WhatsApp inválido' }, { status: 400 });
  }
  const normalizedPhone = normalizePhone(body.phone);
  const lead = await addLead({ ...body, phone: normalizedPhone });
  return NextResponse.json({ ok: true, lead });
}

export async function GET() {
  const leads = await listLeads();
  return NextResponse.json({ leads });
}
