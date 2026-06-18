import type { Status } from '@/types';
import { STATUS_CONFIG } from '@/lib/designTokens';

interface EstadoBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

export function EstadoBadge({ status, size = 'md' }: EstadoBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['pendiente'];
  const wrapClass = size === 'sm'
    ? 'inline-flex items-center gap-[6px] px-[10px] py-1 rounded-full font-sans text-[12px] font-medium shrink-0 w-fit'
    : 'inline-flex items-center gap-[6px] px-[11px] py-1 rounded-full font-sans text-[12.5px] font-medium shrink-0 w-fit';
  const dotClass = size === 'sm' ? 'w-[6px] h-[6px] rounded-full shrink-0' : 'w-[7px] h-[7px] rounded-full shrink-0';

  return (
    <span className={wrapClass} style={{ background: cfg.bg, color: cfg.color }}>
      <span className={dotClass} style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}
