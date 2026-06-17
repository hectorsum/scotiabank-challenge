export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-[18px] max-w-[1120px]">
      <div
        className="gs-dash-cards grid gap-[14px]"
        style={{ gridTemplateColumns: 'repeat(5,1fr)' }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="gs-skel h-[118px] rounded-lg" />
        ))}
      </div>

      <div className="gs-skel h-[54px] rounded-lg" />

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="gs-skel h-16 rounded-lg" />
      ))}

      <div className="flex items-center gap-[10px] text-fg-muted font-mono text-[12px] mt-1">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="gs-spin">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Cargando solicitudes…
      </div>
    </div>
  );
}
