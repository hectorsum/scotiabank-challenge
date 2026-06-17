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
  baja: '#8C857A',
  media: '#B98A3A',
  alta: '#C8965A',
  crítica: '#C84B4B',
};

export const STATUS_COLORS: Record<string, string> = {
  pendiente: '#6E675B',
  'en revisión': '#97601C',
  aprobada: '#2E7B4E',
  rechazada: '#B23A3A',
  cerrada: '#57534A',
};

export const ITEMS_PER_PAGE = 10;