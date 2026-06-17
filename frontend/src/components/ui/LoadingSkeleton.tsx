export function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '1120px' }}>
      <div
        className="gs-dash-cards"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '14px' }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="gs-skel"
            style={{ height: '118px', borderRadius: '10px' }}
          />
        ))}
      </div>
      <div className="gs-skel" style={{ height: '54px', borderRadius: '10px' }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="gs-skel"
          style={{ height: '64px', borderRadius: '10px' }}
        />
      ))}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#8C857A',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          marginTop: '4px',
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="gs-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Cargando solicitudes…
      </div>
    </div>
  );
}
