'use client';

import { EstadoBadge } from '../ui/EstadoBadge';
import { PrioridadBadge } from '../ui/PrioridadBadge';
import {
  STATUS_CONFIG,
  STATUS_ORDER,
  formatShort,
  formatSolicitudId,
} from '@/lib/designTokens';
import type { Status, Priority, Solicitud } from '@/types';

type SortBy = 'recientes' | 'antiguos' | 'prioridad' | 'titulo';

interface BandejaFilters {
  status: Status | 'todos';
  priority: Priority | 'todos';
  search: string;
  sortBy: SortBy;
}

interface BandejaProps {
  solicitudes: Solicitud[];
  filters: BandejaFilters;
  counts: Record<Status, number>;
  total: number;
  onFilterChange: (partial: Partial<BandejaFilters>) => void;
  onClearFilters: () => void;
  onRowClick: (id: number) => void;
}

const INPUT_CLASS = 'gs-input w-full py-[11px] px-[14px] border border-[rgba(20,17,13,0.14)] rounded-md bg-bg-surface font-sans text-[14px] text-fg-primary cursor-pointer';

export function Bandeja({
  solicitudes,
  filters,
  counts,
  total,
  onFilterChange,
  onClearFilters,
  onRowClick,
}: BandejaProps) {
  const chipData = [
    { key: 'todos' as const, label: 'Todas', count: total, dot: null },
    ...STATUS_ORDER.map((k) => ({ key: k, label: STATUS_CONFIG[k].label, count: counts[k], dot: STATUS_CONFIG[k].dot })),
  ];

  const isEmpty = solicitudes.length === 0;
  const resultLabel = solicitudes.length + (solicitudes.length === 1 ? ' solicitud' : ' solicitudes');

  return (
    <div className="gs-enter max-w-[1180px]">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center mb-[18px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-fg-faint inline-flex">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            className="gs-input w-full py-[11px] pr-[14px] pl-10 border border-[rgba(20,17,13,0.14)] rounded-md bg-bg-surface font-sans text-[14px] text-fg-primary"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Buscar por título, solicitante o ID…"
          />
        </div>

        {/* Priority filter */}
        <select
          className={INPUT_CLASS}
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value as Priority | 'todos' })}
        >
          <option value="todos">Toda prioridad</option>
          <option value="crítica">Crítica</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>

        {/* Sort */}
        <select
          className={INPUT_CLASS}
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as SortBy })}
        >
          <option value="recientes">Más recientes</option>
          <option value="antiguos">Más antiguas</option>
          <option value="prioridad">Mayor prioridad</option>
          <option value="titulo">Título A–Z</option>
        </select>
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2 mb-[18px]">
        {chipData.map(({ key, label, count, dot }) => {
          const active = filters.status === key;
          return (
            <button
              key={key}
              onClick={() => onFilterChange({ status: key })}
              className="inline-flex items-center gap-[7px] py-[7px] px-[14px] rounded-full cursor-pointer font-sans text-[13px] font-medium"
              style={{
                border: `1px solid ${active ? '#161310' : 'rgba(20,17,13,0.12)'}`,
                background: active ? '#161310' : '#FFFFFF',
                color: active ? '#F4F1EA' : '#57534A',
              }}
            >
              {dot && <span className="w-[7px] h-[7px] rounded-full" style={{ background: dot }} />}
              {label}
              <span className="font-mono text-[11.5px] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-xl overflow-hidden">
        {/* Header row */}
        <div
          className="gs-head-row grid gap-4 px-[22px] py-[13px] border-b border-[rgba(20,17,13,0.08)] bg-bg-hover"
          style={{ gridTemplateColumns: '90px 1fr 150px 140px 120px 130px 90px' }}
        >
          {['ID', 'Solicitud', 'Solicitante', 'Categoría', 'Prioridad', 'Estado', 'Actualizada'].map((h) => (
            <span
              key={h}
              className={`font-sans text-[10.5px] tracking-[0.1em] uppercase text-fg-faint${h === 'Actualizada' ? ' text-right' : ''}`}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {solicitudes.map((row) => (
          <button
            key={row.id}
            className="gs-row-hover gs-row grid gap-4 items-center w-full text-left border-none border-b border-[rgba(20,17,13,0.06)] bg-bg-surface cursor-pointer px-[22px] py-[15px]"
            style={{ gridTemplateColumns: '90px 1fr 150px 140px 120px 130px 90px' }}
            onClick={() => onRowClick(row.id)}
          >
            <span className="font-mono text-[12px] text-fg-faint">{formatSolicitudId(row.id)}</span>
            <span className="flex flex-col gap-[3px] min-w-0">
              <span className="font-sans text-[14.5px] font-medium text-fg-primary whitespace-nowrap overflow-hidden text-ellipsis">
                {row.title}
              </span>
              <span className="gs-cell-label hidden font-mono text-[11px] text-fg-faint">
                {row.requester} · {row.category} · {formatShort(row.lastChangeDate)}
              </span>
            </span>
            <span className="font-sans text-[13.5px] text-fg-secondary whitespace-nowrap overflow-hidden text-ellipsis">{row.requester}</span>
            <span className="font-sans text-[13px] text-fg-secondary whitespace-nowrap overflow-hidden text-ellipsis">{row.category}</span>
            <PrioridadBadge priority={row.priority} />
            <EstadoBadge status={row.status} size="sm" />
            <span className="font-mono text-[11.5px] text-fg-faint text-right">{formatShort(row.lastChangeDate)}</span>
          </button>
        ))}

        {/* Empty state */}
        {isEmpty && (
          <div className="py-14 px-6 text-center flex flex-col items-center gap-3">
            <span className="text-[#C9C3B6]">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <p className="m-0 text-fg-muted text-[14.5px]">No hay solicitudes que coincidan con los filtros.</p>
            <button
              onClick={onClearFilters}
              className="border-none bg-transparent cursor-pointer font-sans text-[13.5px] text-accent"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <div className="mt-[14px] font-mono text-[12px] text-fg-faint">{resultLabel}</div>
    </div>
  );
}
