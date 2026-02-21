'use client';

import { FormEvent, useEffect, useState } from 'react';

type FormState = { full_name: string; company: string; phone: string };

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [lastPhone, setLastPhone] = useState('');
  const [form, setForm] = useState<FormState>({ full_name: '', company: '', phone: '' });

  useEffect(() => {
    const handler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-lead-modal]')) return;
      const button = target?.closest('button');
      if (!button) return;
      event.preventDefault();
      setIsOpen(true);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, source: '/' }),
    });
    setIsSubmitting(false);
    if (res.ok) {
      const payload = await res.json();
      setLeadId(payload?.lead?.id || null);
      setLastPhone(form.phone);
      setForm({ full_name: '', company: '', phone: '' });
      return;
    }
    try {
      const payload = await res.json();
      setError(payload?.error || 'No se pudo enviar.');
    } catch (_err) {
      setError('No se pudo enviar.');
    }
  }

  if (!isOpen) return null;

  return (
    <div data-lead-modal className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-xl border-4 border-primary bg-charcoal p-8">
        <h3 className="mb-6 text-3xl font-black uppercase">Acceder al Catálogo</h3>
        {leadId ? (
          <div className="space-y-4">
            <p className="text-sm text-white/70">
              Para confirmar tu WhatsApp, abre el chat y envía el mensaje automático.
            </p>
            <a
              href={`https://wa.me/${encodeURIComponent(
                (lastPhone || '').replace(/[^\d+]/g, '')
              )}?text=${encodeURIComponent('Hola, quiero acceder al catálogo de Log10Music.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded bg-primary px-6 py-3 text-xs font-black text-charcoal"
              onClick={async () => {
                try {
                  await fetch('/api/leads/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: leadId }),
                  });
                } catch (_err) {
                  // ignore
                }
              }}
            >
              Confirmar WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                setLeadId(null);
                setLastPhone('');
                setIsOpen(false);
              }}
              className="block text-xs font-black text-white/60"
            >
              Cerrar
            </button>
          </div>
        ) : (
        <form onSubmit={submitLead} className="space-y-4">
          <input
            required
            placeholder="Nombre"
            className="w-full border border-white/20 bg-industrial p-4 font-bold"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <input
            required
            placeholder="Empresa"
            className="w-full border border-white/20 bg-industrial p-4 font-bold"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            required
            placeholder="WhatsApp"
            className="w-full border border-white/20 bg-industrial p-4 font-bold"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div className="flex gap-4">
            <button type="submit" disabled={isSubmitting} className="bg-primary px-6 py-3 font-black text-charcoal">
              {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
            </button>
            <button
              type="button"
              onClick={() => {
                setLeadId(null);
                setLastPhone('');
                setIsOpen(false);
              }}
              className="border border-white/30 px-6 py-3 font-black"
            >
              CERRAR
            </button>
          </div>
          {error ? <p className="text-xs text-red-300">{error}</p> : null}
        </form>
        )}
      </div>
    </div>
  );
}
