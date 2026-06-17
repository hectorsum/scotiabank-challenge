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
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '10px',
        background: '#161310',
        boxShadow: '0 12px 40px rgba(20,17,13,0.28)',
        animation: 'gsToast 0.4s cubic-bezier(0.16,1,0.3,1) both',
        maxWidth: '360px',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          borderRadius: '9999px',
          background: iconBg,
          color: '#FFFFFF',
          flexShrink: 0,
        }}
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
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '14px',
          color: '#F4F1EA',
        }}
      >
        {message}
      </span>
    </div>
  );
}
