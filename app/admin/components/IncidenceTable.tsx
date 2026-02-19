'use client';

import { useState, type FormEvent } from 'react';

type Issue = {
  issueId: string;
  type: string;
  vendorId: string;
  fileId: string;
  fileName: string;
  detail: Record<string, unknown>;
};

type IncidenceTableProps = {
  issues: Issue[];
};

export default function IncidenceTable({ issues }: IncidenceTableProps) {
  const [resolved, setResolved] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  async function handleResolve(issue: Issue, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const model = String(formData.get('model') || '');
    const brand = String(formData.get('brand') || '') || null;
    const sourceRowId = String(issue.detail?.sourceRowId || issue.issueId);
    try {
      const response = await fetch('/api/catalog/mapping', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          issueId: issue.issueId,
          vendorId: issue.vendorId,
          sourceRowId,
          model,
          brand,
        }),
      });
      if (!response.ok) {
        setMessages((prev) => ({
          ...prev,
          [issue.issueId]: 'No se pudo resolver la incidencia.',
        }));
        return;
      }
      setResolved((prev) => ({ ...prev, [issue.issueId]: true }));
      setMessages((prev) => ({ ...prev, [issue.issueId]: 'Incidencia resuelta.' }));
    } catch (error) {
      setMessages((prev) => ({
        ...prev,
        [issue.issueId]: 'Error de red al resolver.',
      }));
    }
  }

  if (!issues.length) {
    return (
      <div className="rounded border border-white/10 bg-industrial p-6 text-white/60">
        No hay incidencias abiertas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div key={issue.issueId} className="rounded border border-white/10 bg-industrial p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase text-white/50">{issue.type}</p>
              <p className="text-lg font-black">{issue.fileName}</p>
              <p className="text-xs text-white/50">Proveedor: {issue.vendorId}</p>
            </div>
            <span className="rounded bg-white/10 px-3 py-1 text-xs font-black">
              {resolved[issue.issueId] ? 'Resuelto' : 'Pendiente'}
            </span>
          </div>
          <form onSubmit={(event) => handleResolve(issue, event)} className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              name="model"
              placeholder="Modelo correcto"
              className="rounded border border-white/20 bg-charcoal px-3 py-2 text-sm"
              required
              minLength={2}
            />
            <input
              name="brand"
              placeholder="Marca (opcional)"
              className="rounded border border-white/20 bg-charcoal px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-xs font-black text-charcoal"
            >
              Resolver
            </button>
          </form>
          {messages[issue.issueId] ? (
            <p className="mt-3 text-xs text-emerald-300">{messages[issue.issueId]}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
