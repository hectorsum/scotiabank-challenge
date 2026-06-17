'use client';

interface ErrorStateProps {
  message?: string;
  endpoint?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'El servicio respondió con un error. Verifica tu conexión e inténtalo nuevamente.',
  endpoint = 'GET /api/v1/solicitudes',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="gs-enter max-w-[560px] mx-auto mt-12 text-center flex flex-col items-center gap-[18px]">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-error" style={{ background: 'rgba(200,75,75,0.10)' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      </div>

      <div>
        <h3 className="font-serif text-[28px] text-fg-primary mb-2">
          No se pudieron cargar las solicitudes
        </h3>
        <p className="m-0 text-fg-secondary text-[15px] max-w-[420px] mx-auto">
          {message}
        </p>
        <div className="font-mono text-[12px] text-error mt-3">
          {endpoint} — 503 Service Unavailable
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="gs-pbtn inline-flex items-center gap-2 px-[22px] h-11 border-none rounded-sm text-white font-sans text-[14px] font-semibold cursor-pointer bg-accent"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          Reintentar
        </button>
      )}
    </div>
  );
}
