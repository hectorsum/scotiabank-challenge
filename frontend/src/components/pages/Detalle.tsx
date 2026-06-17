'use client';

import { useState } from 'react';
import { EstadoBadge } from '../ui/EstadoBadge';
import {
  STATUS_CONFIG,
  STATUS_ORDER,
  PRIORITY_CONFIG,
  PRIORITY_ORDER,
  ACCENT,
  getPriorityBars,
  formatFull,
  formatSolicitudId,
} from '@/lib/designTokens';
import type { Status, Priority, Solicitud } from '@/types';

interface HistoryEntry {
  label: string;
  date: string;
}

interface DetalleProps {
  solicitud: Solicitud;
  history?: HistoryEntry[];
  onBack: () => void;
  onEdit: () => void;
  onPriorityChange: (priority: Priority) => void;
  onStatusChange: (status: Status) => void;
  onClose: () => void;
}

export function Detalle({
  solicitud,
  history = [],
  onBack,
  onEdit,
  onPriorityChange,
  onStatusChange,
  onClose,
}: DetalleProps) {
  const [confirmClose, setConfirmClose] = useState(false);
  const canClose = solicitud.status !== 'cerrada';
  const priorityCfg = PRIORITY_CONFIG[solicitud.priority] ?? PRIORITY_CONFIG['media'];

  return (
    <div className="gs-enter max-w-[920px]">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-[7px] border-none bg-transparent cursor-pointer font-sans text-[13.5px] text-fg-muted mb-5 p-0"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver a la bandeja
      </button>

      <div className="gs-grid-2 grid gap-6" style={{ gridTemplateColumns: '1fr 320px' }}>

        {/* Main column */}
        <div className="flex flex-col gap-6">

          {/* Info card */}
          <div className="bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-xl p-7">
            <div className="flex items-center gap-3 flex-wrap mb-[14px]">
              <span className="font-mono text-[13px]" style={{ color: ACCENT }}>
                {formatSolicitudId(solicitud.id)}
              </span>
              <EstadoBadge status={solicitud.status} />
            </div>
            <h2 className="font-serif text-[34px] leading-[1.12] text-fg-primary tracking-[-0.01em] mb-[18px]">
              {solicitud.title}
            </h2>
            <p className="text-[15.5px] leading-[1.65]" style={{ color: '#3F3B33' }}>
              {solicitud.description}
            </p>
          </div>

          {/* Priority (PATCH) */}
          <div className="bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-xl p-6">
            <div className="font-sans text-[10.5px] tracking-[0.12em] uppercase text-fg-faint mb-3">
              Prioridad · PATCH
            </div>
            <div className="flex gap-2 flex-wrap">
              {PRIORITY_ORDER.map((key) => {
                const cfg = PRIORITY_CONFIG[key];
                const active = solicitud.priority === key;
                const bars = getPriorityBars(key);
                return (
                  <button
                    key={key}
                    onClick={() => onPriorityChange(key)}
                    className="inline-flex items-center gap-2 py-[9px] px-4 rounded-md cursor-pointer font-sans text-[13.5px] font-medium"
                    style={{
                      border: `1px solid ${active ? ACCENT : 'rgba(20,17,13,0.12)'}`,
                      background: active ? 'rgba(200,150,90,0.12)' : '#FFFFFF',
                      color: active ? '#161310' : '#57534A',
                    }}
                  >
                    <span className="inline-flex items-end gap-[2px] h-[13px]">
                      {bars.map((b, i) => (
                        <span key={i} className="w-[3px] rounded-[1px]" style={{ height: b.h, background: b.bg }} />
                      ))}
                    </span>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status change */}
          <div className="bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-xl p-6">
            <div className="font-sans text-[10.5px] tracking-[0.12em] uppercase text-fg-faint mb-3">
              Cambiar estado
            </div>
            <div className="flex gap-2 flex-wrap">
              {STATUS_ORDER.map((key) => {
                const cfg = STATUS_CONFIG[key];
                const active = solicitud.status === key;
                return (
                  <button
                    key={key}
                    onClick={() => onStatusChange(key)}
                    className="inline-flex items-center gap-[7px] py-[9px] px-[15px] rounded-md cursor-pointer font-sans text-[13px] font-medium"
                    style={{
                      border: `1px solid ${active ? cfg.dot : 'rgba(20,17,13,0.12)'}`,
                      background: active ? cfg.bg : '#FFFFFF',
                      color: active ? cfg.color : '#57534A',
                    }}
                  >
                    <span className="w-[7px] h-[7px] rounded-full" style={{ background: cfg.dot }} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-xl p-6">
              <div className="font-sans text-[10.5px] tracking-[0.12em] uppercase text-fg-faint mb-[18px]">
                Historial
              </div>
              <div className="flex flex-col">
                {[...history].reverse().map((h, i) => (
                  <div key={i} className="flex gap-[14px]">
                    <div className="flex flex-col items-center shrink-0">
                      <span className="w-[10px] h-[10px] rounded-full mt-1" style={{ background: ACCENT }} />
                      {i < history.length - 1 && (
                        <span className="w-px flex-1 min-h-[18px]" style={{ background: 'rgba(20,17,13,0.10)' }} />
                      )}
                    </div>
                    <div className="pb-[18px]">
                      <div className="font-sans text-[14px] text-fg-primary">{h.label}</div>
                      <div className="font-mono text-[11.5px] text-fg-faint mt-[2px]">{h.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side meta */}
        <div className="flex flex-col gap-4">
          <div className="bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-xl p-[22px] flex flex-col gap-4">
            {[
              { label: 'Solicitante',          value: solicitud.requester,                         mono: false },
              { label: 'Categoría',            value: solicitud.category,                          mono: false },
              { label: 'Prioridad',            value: priorityCfg.label, color: priorityCfg.color, mono: false },
              { label: 'Creada',               value: formatFull(solicitud.creationDate),          mono: true  },
              { label: 'Última actualización', value: formatFull(solicitud.lastChangeDate),        mono: true  },
            ].map(({ label, value, mono, color }, i, arr) => (
              <div key={label}>
                <div className="font-sans text-[10.5px] tracking-[0.12em] uppercase text-fg-faint mb-[5px]">
                  {label}
                </div>
                <div
                  className={`${mono ? 'font-mono text-[13px]' : 'font-sans text-[15px]'} ${color ? 'font-medium' : ''}`}
                  style={{ color: color ?? (mono ? '#57534A' : '#161310') }}
                >
                  {value}
                </div>
                {i < arr.length - 1 && <div className="h-px mt-4" style={{ background: 'rgba(20,17,13,0.07)' }} />}
              </div>
            ))}
          </div>

          <button
            className="gs-pbtn inline-flex items-center justify-center gap-2 h-[46px] border-none rounded-md bg-fg-primary text-bg-page font-sans text-[14px] font-semibold cursor-pointer"
            onClick={onEdit}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
            Editar solicitud
          </button>

          {/* Close confirmation */}
          {confirmClose ? (
            <div
              className="border rounded-md p-4"
              style={{ background: 'rgba(200,75,75,0.06)', borderColor: 'rgba(200,75,75,0.25)' }}
            >
              <div className="font-sans text-[13.5px] text-fg-primary mb-3">
                ¿Cerrar esta solicitud? No podrá volver a estado abierto.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { onClose(); setConfirmClose(false); }}
                  className="flex-1 border-none cursor-pointer py-[9px] rounded-sm bg-error text-white font-sans text-[13px] font-semibold"
                >
                  Sí, cerrar
                </button>
                <button
                  onClick={() => setConfirmClose(false)}
                  className="flex-1 border border-[rgba(20,17,13,0.14)] cursor-pointer py-[9px] rounded-sm bg-bg-surface text-fg-secondary font-sans text-[13px] font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : canClose ? (
            <button
              onClick={() => setConfirmClose(true)}
              className="inline-flex items-center justify-center gap-2 h-11 border border-[rgba(200,75,75,0.35)] rounded-md bg-transparent text-error font-sans text-[13.5px] font-medium cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              Cerrar solicitud
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
