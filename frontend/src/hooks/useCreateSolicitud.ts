'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSolicitudStore, useUIStore } from '@/store';
import { solicitudService } from '@/services/solicitudService';
import type { CreateSolicitudDTO } from '@/types';

export function useCreateSolicitud() {
  const queryClient = useQueryClient();
  const { addSolicitud } = useSolicitudStore();
  const { showNotification } = useUIStore();

  const mutation = useMutation({
    mutationFn: (data: CreateSolicitudDTO) =>
      solicitudService.createSolicitud(data),
    onSuccess: (solicitud) => {
      addSolicitud(solicitud);
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      showNotification('success', 'Solicitud creada correctamente.');
    },
    onError: (error) => {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Error al crear la solicitud.'
      );
    },
  });

  return {
    create: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    success: mutation.isSuccess,
    reset: mutation.reset,
  };
}
