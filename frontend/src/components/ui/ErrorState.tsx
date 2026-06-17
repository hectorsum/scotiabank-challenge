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
    <div
      className="gs-enter"
      style={{
        maxWidth: '560px',
        margin: '48px auto 0',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '9999px',
          background: 'rgba(200,75,75,0.10)',
          color: '#C84B4B',
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      </div>

      <div>
        <h3
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: '28px',
            color: '#161310',
            marginBottom: '8px',
          }}
        >
          No se pudieron cargar las solicitudes
        </h3>
        <p style={{ margin: '0 auto', color: '#57534A', fontSize: '15px', maxWidth: '420px' }}>
          {message}
        </p>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: '#C84B4B',
            marginTop: '12px',
          }}
        >
          {endpoint} — 503 Service Unavailable
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="gs-pbtn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 22px',
            height: '44px',
            border: 'none',
            borderRadius: '7px',
            background: '#C8965A',
            color: '#FFFFFF',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          Reintentar
        </button>
      )}
    </div>
  );
}
