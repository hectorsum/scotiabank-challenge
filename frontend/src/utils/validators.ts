import { z } from 'zod';
import { PRIORITIES, CATEGORIES, STATUSES } from './constants';

export const createSolicitudSchema = z.object({
  title: z
    .string()
    .min(1, 'Título es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  description: z
    .string()
    .min(1, 'Descripción es obligatoria')
    .max(1000, 'Máximo 1000 caracteres'),
  requester: z
    .string()
    .min(1, 'Solicitante es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: 'Categoría inválida' }),
  }),
  priority: z.enum(PRIORITIES, {
    errorMap: () => ({ message: 'Prioridad inválida' }),
  }),
});

export const updateSolicitudSchema = createSolicitudSchema.extend({
  status: z.enum(STATUSES, {
    errorMap: () => ({ message: 'Estado inválido' }),
  }),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(PRIORITIES, {
    errorMap: () => ({ message: 'Prioridad inválida' }),
  }),
});

export type CreateSolicitudInput = z.infer<typeof createSolicitudSchema>;
export type UpdateSolicitudInput = z.infer<typeof updateSolicitudSchema>;
export type UpdatePriorityInput = z.infer<typeof updatePrioritySchema>;