'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSolicitudStore, useUIStore } from '@/store';
import { solicitudService } from '@/services/solicitudService';
import type { UpdateSolicitudDTO, Priority } from '@/types';

export function useUpdateSolicitud(id: number) {
  const queryClient = useQueryClient();
  const { updateSolicitudInList } = useSolicitudStore();
  const { showNotification } = useUIStore();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['solicitud', id] });
    queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
  };

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSolicitudDTO) =>
      solicitudService.updateSolicitud(id, data),
    onSuccess: (solicitud) => {
      updateSolicitudInList(id, solicitud);
      invalidate();
      showNotification('success', 'Solicitud actualizada correctamente.');
    },
    onError: (error) => {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Error al actualizar la solicitud.'
      );
    },
  });

  const priorityMutation = useMutation({
    mutationFn: (priority: Priority) =>
      solicitudService.updatePriority(id, priority),
    onSuccess: (solicitud) => {
      updateSolicitudInList(id, solicitud);
      invalidate();
      showNotification('success', 'Prioridad actualizada.');
    },
    onError: (error) => {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Error al actualizar la prioridad.'
      );
    },
  });

  const activeError = updateMutation.error ?? priorityMutation.error;

  return {
    update: updateMutation.mutateAsync,
    updatePriority: priorityMutation.mutateAsync,
    loading: updateMutation.isPending || priorityMutation.isPending,
    error: activeError instanceof Error ? activeError.message : null,
    success: updateMutation.isSuccess || priorityMutation.isSuccess,
    reset: () => { updateMutation.reset(); priorityMutation.reset(); },
  };
}
