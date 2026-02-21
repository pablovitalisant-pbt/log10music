'use client';

import { useEffect, useState } from 'react';

export default function SyncButton() {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    filesScanned?: number;
    filesProcessed?: number;
    rowsParsed?: number;
    productsAvailable?: number;
  } | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/catalog/sync-runs', { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        const items = Array.isArray(payload?.items) ? payload.items : [];
        let current = runId ? items.find((item: any) => item.runId === runId) : items[0];
        if (!current && items.length > 0) current = items[0];
        if (current) {
          setRunId(current.runId);
          setStats(current.stats || null);
          if (current.finishedAt) {
            setStage('Finalizado');
            setIsRunning(false);
            setMessage('Sincronizacion finalizada.');
            return;
          }
          if ((current.stats?.filesProcessed || 0) === 0) {
            setStage('Descubriendo archivos');
          } else if ((current.stats?.rowsParsed || 0) === 0) {
            setStage('Parseando filas');
          } else if ((current.stats?.productsAvailable || 0) === 0) {
            setStage('Generando catalogo');
          } else {
            setStage('Actualizando catalogo');
          }
        }
      } catch (pollError) {
        // ignore polling errors
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isRunning, runId]);

  async function handleSync() {
    if (isRunning) return;
    setIsRunning(true);
    setError(null);
    setMessage(null);
    setStage('Iniciando');
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
          } else if (payload) {
            serverError = JSON.stringify(payload);
          }
        } catch (parseError) {
          try {
            serverError = await response.text();
          } catch (_readError) {
            serverError = '';
          }
        }
        setError(
          serverError || `No se pudo iniciar la sincronizacion (HTTP ${response.status})`
        );
        setIsRunning(false);
        return;
      }
      const payload = await response.json();
      if (payload?.runId) {
        setRunId(payload.runId);
      }
      setMessage('Sincronizacion en curso.');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'No se pudo iniciar la sincronizacion');
      setIsRunning(false);
    } finally {
      // keep running state until polling sees finishedAt
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
      {stage ? (
        <span className="text-xs text-white/70">
          {stage}
          {stats ? (
            <>
              {' '}
              · Archivos {stats.filesProcessed ?? 0}/{stats.filesScanned ?? 0} · Filas{' '}
              {stats.rowsParsed ?? 0} · Productos {stats.productsAvailable ?? 0}
            </>
          ) : null}
        </span>
      ) : null}
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </div>
  );
}
