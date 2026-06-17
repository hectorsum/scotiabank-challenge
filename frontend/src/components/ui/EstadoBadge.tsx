import type { Status } from '@/types';
import { STATUS_CONFIG } from '@/lib/designTokens';

interface EstadoBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

export function EstadoBadge({ status, size = 'md' }: EstadoBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['pendiente'];
  const dotPx = size === 'sm' ? '6px' : '7px';
  const padding = size === 'sm' ? '4px 10px' : '4px 11px';
  const fontSize = size === 'sm' ? '12px' : '12.5px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding,
        borderRadius: '9999px',
        fontFamily: "'Outfit', sans-serif",
        fontSize,
        fontWeight: 500,
        background: cfg.bg,
        color: cfg.color,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: dotPx,
          height: dotPx,
          borderRadius: '9999px',
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}
