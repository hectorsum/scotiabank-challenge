import type { Priority } from '@/types';
import { PRIORITY_CONFIG, getPriorityBars } from '@/lib/designTokens';

interface PrioridadBadgeProps {
  priority: Priority;
}

export function PrioridadBadge({ priority }: PrioridadBadgeProps) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG['media'];
  const bars = getPriorityBars(priority);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'flex-end',
          gap: '2px',
          height: '14px',
        }}
      >
        {bars.map((bar, i) => (
          <span
            key={i}
            style={{
              width: '3px',
              borderRadius: '1px',
              height: bar.h,
              background: bar.bg,
            }}
          />
        ))}
      </span>
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '12.5px',
          fontWeight: 500,
          color: cfg.color,
        }}
      >
        {cfg.label}
      </span>
    </span>
  );
}
