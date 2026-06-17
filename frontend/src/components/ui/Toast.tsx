'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onDismiss, duration = 2800 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [onDismiss, duration]);

  const iconBg = type === 'error' ? '#C84B4B' : type === 'warning' ? '#C8A94B' : '#4BAB72';

  return (
    <div
      className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 px-[18px] py-[14px] rounded-lg bg-fg-primary max-w-[360px]"
      style={{
        boxShadow: '0 12px 40px rgba(20,17,13,0.28)',
        animation: 'gsToast 0.4s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <span
        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white shrink-0"
        style={{ background: iconBg }}
      >
        {type === 'error' ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span className="font-sans text-[14px] text-bg-page">
        {message}
      </span>
    </div>
  );
}
