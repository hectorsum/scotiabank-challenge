export const PRIORITIES = ['baja', 'media', 'alta', 'crítica'] as const;
export const STATUSES = ['pendiente', 'en revisión', 'aprobada', 'rechazada', 'cerrada'] as const;
export const CATEGORIES = [
  'infraestructura',
  'recursos_humanos',
  'financiero',
  'administrativo',
  'tecnología',
] as const;

export const PRIORITY_COLORS: Record<string, string> = {
  baja: '#3b82f6',
  media: '#f59e0b',
  alta: '#ef4444',
  crítica: '#7c3aed',
};

export const STATUS_COLORS: Record<string, string> = {
  pendiente: '#fbbf24',
  'en revisión': '#60a5fa',
  aprobada: '#10b981',
  rechazada: '#ef4444',
  cerrada: '#6b7280',
};

export const ITEMS_PER_PAGE = 10;