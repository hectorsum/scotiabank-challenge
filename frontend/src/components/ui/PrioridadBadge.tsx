import type { Priority } from '@/types';
import { PRIORITY_CONFIG, getPriorityBars } from '@/lib/designTokens';

interface PrioridadBadgeProps {
  priority: Priority;
}

export function PrioridadBadge({ priority }: PrioridadBadgeProps) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG['media'];
  const bars = getPriorityBars(priority);

  return (
    <span className="inline-flex items-center gap-[7px]">
      <span className="inline-flex items-end gap-[2px] h-[14px]">
        {bars.map((bar, i) => (
          <span
            key={i}
            className="w-[3px] rounded-[1px]"
            style={{ height: bar.h, background: bar.bg }}
          />
        ))}
      </span>
      <span className="font-sans text-[12.5px] font-medium" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </span>
  );
}
