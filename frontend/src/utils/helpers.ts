import { Priority, Status } from '@/types';
import { PRIORITY_COLORS, STATUS_COLORS } from './constants';

export function getPriorityColor(priority: Priority): string {
  return PRIORITY_COLORS[priority] || '#gray';
}

export function getStatusColor(status: Status): string {
  return STATUS_COLORS[status] || '#gray';
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDatetime(dateString: string): string {
  return new Date(dateString).toLocaleString('es-ES');
}