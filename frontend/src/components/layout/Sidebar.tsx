'use client';

import { ACCENT } from '@/lib/designTokens';

type Page = 'dashboard' | 'bandeja' | 'crear' | 'detalle';
type ApiStatus = 'ok' | 'error';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  totalRequests: number;
  apiStatus: ApiStatus;
  onApiStatusChange: (status: ApiStatus) => void;
  onNavigate: (page: Page) => void;
  orgName?: string;
}

const NAV_ITEMS: Array<{ page: Page; label: string; icon: React.ReactNode }> = [
  {
    page: 'dashboard',
    label: 'Resumen',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    page: 'bandeja',
    label: 'Solicitudes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    ),
  },
  {
    page: 'crear',
    label: 'Nueva solicitud',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
];

export function Sidebar({
  isOpen,
  onClose,
  currentPage,
  totalRequests,
  apiStatus,
  onApiStatusChange,
  onNavigate,
  orgName = 'Organización',
}: SidebarProps) {
  const isActive = (page: Page) =>
    page === currentPage || (page === 'bandeja' && currentPage === 'detalle');

  return (
    <aside
      className={`gs-sidebar${isOpen ? ' open' : ''} w-64 shrink-0 bg-bg-surface border-r border-[rgba(20,17,13,0.09)] flex flex-col px-5 py-7 sticky top-0 h-screen`}
    >
      {/* Logo */}
      <div className="flex flex-col gap-[2px] px-2 pb-1">
        <div className="font-serif text-[26px] leading-[1.05] text-fg-primary">Gestor</div>
        <div className="font-mono text-[11px] tracking-[0.04em]" style={{ color: ACCENT }}>
          de solicitudes
        </div>
        <div className="font-sans text-[11px] tracking-[0.14em] uppercase text-fg-faint mt-[6px]">
          {orgName}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 mt-8">
        {NAV_ITEMS.map(({ page, label, icon }) => {
          const active = isActive(page);
          return (
            <button
              key={page}
              className="gs-nav-hover flex items-center gap-3 w-full text-left border-none cursor-pointer px-[14px] py-[11px] rounded-xs font-sans text-[14.5px] font-medium transition-colors duration-150"
              onClick={() => { onNavigate(page); onClose(); }}
              style={{
                background: active ? 'rgba(200,150,90,0.13)' : 'transparent',
                color: active ? '#161310' : '#57534A',
              }}
            >
              <span className="inline-flex w-[18px]" style={{ color: active ? ACCENT : '#8C857A' }}>
                {icon}
              </span>
              {label}
              {page === 'bandeja' && (
                <span className="ml-auto font-mono text-[11px] text-fg-faint">
                  {totalRequests}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
