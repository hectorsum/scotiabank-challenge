'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSolicitudStore, useUIStore } from '@/store';
import { solicitudService } from '@/services/solicitudService';

export function useDeleteSolicitud(id: number) {
  const queryClient = useQueryClient();
  const { removeSolicitudFromList } = useSolicitudStore();
  const { showNotification } = useUIStore();

  const mutation = useMutation({
    mutationFn: () => solicitudService.deleteSolicitud(id),
    onSuccess: () => {
      removeSolicitudFromList(id);
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      queryClient.removeQueries({ queryKey: ['solicitud', id] });
      showNotification('success', 'Solicitud eliminada correctamente.');
    },
    onError: (error) => {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Error al eliminar la solicitud.'
      );
    },
  });

  return {
    remove: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    success: mutation.isSuccess,
    reset: mutation.reset,
  };
}
