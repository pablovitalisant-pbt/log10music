'use client';

import { useState } from 'react';

export default function SyncButton() {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSync() {
    if (isRunning) return;
    setIsRunning(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch('/api/catalog/sync', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        let serverError = '';
        try {
          const payload = await response.json();
          if (payload && typeof payload.error === 'string') {
            serverError = payload.error;
          }
        } catch (parseError) {
          serverError = '';
        }
        setError(serverError || 'No se pudo iniciar la sincronizacion');
        return;
      }
      setMessage('Sincronizacion iniciada. Refresca en unos segundos.');
    } catch (err) {
      setError('No se pudo iniciar la sincronizacion');
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleSync}
        className="rounded border border-white/30 px-4 py-2 text-xs font-black"
        disabled={isRunning}
      >
        {isRunning ? 'Sincronizando...' : 'Sincronizar catalogo'}
      </button>
      {message ? <span className="text-xs text-emerald-300">{message}</span> : null}
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </div>
  );
}
