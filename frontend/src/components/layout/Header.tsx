'use client';

import { ACCENT } from '@/lib/designTokens';

interface HeaderProps {
  pageTitle: string;
  crumb: string;
  onToggleSidebar: () => void;
  onReload: () => void;
  onNewRequest: () => void;
  isLoading?: boolean;
}

export function Header({
  pageTitle,
  crumb,
  onToggleSidebar,
  onReload,
  onNewRequest,
  isLoading = false,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-[30] flex items-center gap-4 px-7 py-4 border-b border-[rgba(20,17,13,0.08)] backdrop-blur-[10px]"
      style={{ background: 'rgba(244,241,234,0.86)' }}
    >
      {/* Hamburger — visible only on mobile via .gs-burger CSS class */}
      <button
        className="gs-burger hidden items-center justify-center w-[38px] h-[38px] border border-[rgba(20,17,13,0.12)] rounded-sm bg-bg-surface cursor-pointer text-fg-primary"
        onClick={onToggleSidebar}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Title + breadcrumb */}
      <div className="flex flex-col gap-[1px] min-w-0">
        <span className="font-sans text-[10.5px] tracking-[0.14em] uppercase text-fg-faint">
          {crumb}
        </span>
        <h1 className="font-serif text-[26px] leading-[1.1] text-fg-primary m-0 tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis">
          {pageTitle}
        </h1>
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-[10px]">
        <button
          className="gs-pbtn inline-flex items-center justify-center w-10 h-10 border border-[rgba(20,17,13,0.12)] rounded-sm bg-bg-surface cursor-pointer text-fg-secondary"
          onClick={onReload}
          title="Recargar"
        >
          <svg
            width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
            className={isLoading ? 'gs-spin' : ''}
          >
            <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.36-2.64L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>

        <button
          className="gs-pbtn inline-flex items-center gap-2 px-[18px] h-10 border-none rounded-sm text-white font-sans text-[13.5px] font-semibold cursor-pointer shadow-xs"
          style={{ background: ACCENT }}
          onClick={onNewRequest}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nueva
        </button>
      </div>
    </header>
  );
}
