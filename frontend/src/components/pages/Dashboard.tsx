'use client';

import { EstadoBadge } from '../ui/EstadoBadge';
import {
  STATUS_CONFIG,
  STATUS_ORDER,
  formatShort,
  formatSolicitudId,
} from '@/lib/designTokens';
import type { Status, Solicitud } from '@/types';

interface DashboardProps {
  counts: Record<Status, number>;
  total: number;
  criticalCount: number;
  recentItems: Solicitud[];
  onStatusCardClick: (status: Status) => void;
  onGoBandeja: () => void;
  onItemClick: (id: number) => void;
}

export function Dashboard({
  counts,
  total,
  criticalCount,
  recentItems,
  onStatusCardClick,
  onGoBandeja,
  onItemClick,
}: DashboardProps) {
  const distSegments = STATUS_ORDER.filter((k) => counts[k] > 0).map((k) => ({
    key: k,
    dot: STATUS_CONFIG[k].dot,
    label: STATUS_CONFIG[k].label + ': ' + counts[k],
    pct: total ? (counts[k] / total) * 100 + '%' : '0%',
  }));

  return (
    <div className="gs-enter max-w-[1120px]">
      <p className="text-fg-secondary text-[15px] max-w-[640px] mb-[22px]">
        Resumen del estado actual de las solicitudes internas. Selecciona un estado para verlo en la bandeja.
      </p>

      {/* Status cards */}
      <div className="gs-dash-cards grid gap-[14px]" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
        {STATUS_ORDER.map((key) => {
          const cfg = STATUS_CONFIG[key];
          const count = counts[key];
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <button
              key={key}
              className="gs-card-link text-left cursor-pointer bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-[11px] p-[18px] flex flex-col gap-[10px]"
              onClick={() => onStatusCardClick(key)}
            >
              <div className="flex items-center gap-2">
                <span className="w-[9px] h-[9px] rounded-full" style={{ background: cfg.dot }} />
                <span className="font-sans text-[12.5px] font-medium text-fg-secondary">{cfg.label}</span>
              </div>
              <div className="font-serif text-[42px] leading-none text-fg-primary">{count}</div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(20,17,13,0.07)' }}>
                <div className="h-full rounded-full" style={{ background: cfg.dot, width: pct + '%' }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Lower panels */}
      <div className="gs-grid-2 grid gap-[18px] mt-[18px]" style={{ gridTemplateColumns: '1.4fr 1fr' }}>

        {/* Distribution bar */}
        <div className="bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-xl p-6">
          <div className="flex items-baseline justify-between mb-[18px]">
            <h4 className="font-sans text-[16px] font-semibold text-fg-primary">Distribución por estado</h4>
            <span className="font-mono text-[12px] text-fg-muted">{total} total</span>
          </div>
          <div className="flex h-[14px] rounded-full overflow-hidden bg-bg-page">
            {distSegments.map((s) => (
              <div key={s.key} title={s.label} className="h-full" style={{ background: s.dot, width: s.pct }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-[22px] gap-y-[14px] mt-5">
            {STATUS_ORDER.map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-[9px] h-[9px] rounded-full" style={{ background: STATUS_CONFIG[key].dot }} />
                <span className="font-sans text-[13px] text-fg-secondary">{STATUS_CONFIG[key].label}</span>
                <span className="font-mono text-[13px] font-medium text-fg-primary">{counts[key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attention panel */}
        <div className="bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-xl p-6 flex flex-col gap-4">
          <h4 className="font-sans text-[16px] font-semibold text-fg-primary">Requieren atención</h4>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Pendientes',        value: counts['pendiente'],   color: '#161310' },
              { label: 'En revisión',       value: counts['en revisión'], color: '#161310' },
              { label: 'Prioridad crítica', value: criticalCount,         color: '#C84B4B' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[13.5px] text-fg-secondary">{label}</span>
                  <span className="font-serif text-[24px]" style={{ color }}>{value}</span>
                </div>
                <div className="h-px mt-3" style={{ background: 'rgba(20,17,13,0.07)' }} />
              </div>
            ))}
          </div>
          <button
            onClick={onGoBandeja}
            className="mt-auto self-start inline-flex items-center gap-[7px] border border-[rgba(200,150,90,0.4)] bg-transparent text-accent py-[9px] px-4 rounded-sm font-sans text-[13px] font-medium cursor-pointer"
          >
            Ir a la bandeja
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-[26px]">
        <div className="flex items-baseline justify-between mb-[14px]">
          <h4 className="font-sans text-[16px] font-semibold text-fg-primary">Actividad reciente</h4>
          <button
            onClick={onGoBandeja}
            className="border-none bg-transparent cursor-pointer font-sans text-[13px] text-accent"
          >
            ver todas →
          </button>
        </div>
        <div className="bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-xl overflow-hidden">
          {recentItems.map((item) => (
            <button
              key={item.id}
              className="gs-row-hover flex items-center gap-4 w-full text-left border-none border-b border-[rgba(20,17,13,0.06)] bg-bg-surface cursor-pointer px-5 py-[14px]"
              onClick={() => onItemClick(item.id)}
            >
              <span className="font-mono text-[12px] text-fg-faint w-[74px] shrink-0">
                {formatSolicitudId(item.id)}
              </span>
              <span className="flex-1 min-w-0 font-sans text-[14.5px] font-medium text-fg-primary whitespace-nowrap overflow-hidden text-ellipsis">
                {item.title}
              </span>
              <EstadoBadge status={item.status} size="sm" />
              <span className="font-mono text-[11.5px] text-fg-faint shrink-0 w-[62px] text-right">
                {formatShort(item.lastChangeDate)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
