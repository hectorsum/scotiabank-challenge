import type { Status, Priority } from '@/types';

export const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string; bg: string }> = {
  'pendiente':    { label: 'Pendiente',   color: '#6E675B', dot: '#B8AE9C', bg: 'rgba(20,17,13,0.05)' },
  'en revisión':  { label: 'En revisión', color: '#97601C', dot: '#C8965A', bg: 'rgba(200,150,90,0.14)' },
  'aprobada':     { label: 'Aprobada',    color: '#2E7B4E', dot: '#4BAB72', bg: 'rgba(75,171,114,0.13)' },
  'rechazada':    { label: 'Rechazada',   color: '#B23A3A', dot: '#C84B4B', bg: 'rgba(200,75,75,0.11)' },
  'cerrada':      { label: 'Cerrada',     color: '#57534A', dot: '#57534A', bg: 'rgba(20,17,13,0.06)' },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; bars: number; color: string }> = {
  'baja':    { label: 'Baja',    bars: 1, color: '#8C857A' },
  'media':   { label: 'Media',   bars: 2, color: '#B98A3A' },
  'alta':    { label: 'Alta',    bars: 3, color: '#C8965A' },
  'crítica': { label: 'Crítica', bars: 4, color: '#C84B4B' },
};

export const BAR_HEIGHTS = ['5px', '8px', '11px', '14px'] as const;

export const STATUS_ORDER: Status[] = [
  'pendiente', 'en revisión', 'aprobada', 'rechazada', 'cerrada',
];

export const PRIORITY_ORDER: Priority[] = ['baja', 'media', 'alta', 'crítica'];

export const ACCENT = '#C8965A';

export const FORM_CATEGORIES = [
  'Infraestructura',
  'Software',
  'Hardware',
  'Redes',
  'Soporte Técnico',
] as const;

export type FormCategory = (typeof FORM_CATEGORIES)[number];

export function getPriorityBars(
  priority: Priority
): Array<{ h: string; bg: string }> {
  const meta = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG['media'];
  return BAR_HEIGHTS.map((h, i) => ({
    h,
    bg: i < meta.bars ? meta.color : '#DAD4C7',
  }));
}

const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'] as const;

export function formatFull(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
}

export function formatShort(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatSolicitudId(id: number): string {
  return `SOL-${String(id).padStart(4, '0')}`;
}
