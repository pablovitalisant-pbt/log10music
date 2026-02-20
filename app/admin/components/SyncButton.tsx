'use client';

import { useState } from 'react';

export default function SyncButton() {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    if (isRunning) return;
    setIsRunning(true);
    setError(null);
    try {
      const response = await fetch('/api/catalog/sync', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        setError('No se pudo iniciar la sincronizacion');
        return;
      }
      window.location.reload();
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
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </div>
  );
}
