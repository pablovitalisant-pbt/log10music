'use client';

import { FormEvent, useEffect, useState } from 'react';

type FormState = { full_name: string; company: string; phone: string };

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, source: '/' }),
    });
    setIsSubmitting(false);
    if (res.ok) {
      setIsOpen(false);
      setForm({ full_name: '', company: '', phone: '' });
      alert('Diagnóstico solicitado correctamente.');
    }
  }

  if (!isOpen) return null;

  return (
    <div data-lead-modal className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-xl border-4 border-primary bg-charcoal p-8">
        <h3 className="mb-6 text-3xl font-black uppercase">Solicitar Diagnóstico</h3>
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
            <button type="button" onClick={() => setIsOpen(false)} className="border border-white/30 px-6 py-3 font-black">
              CERRAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
