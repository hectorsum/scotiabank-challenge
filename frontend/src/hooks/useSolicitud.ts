'use client';

import { useQuery } from '@tanstack/react-query';
import { solicitudService } from '@/services/solicitudService';

export function useSolicitud(id: number, enabled = true) {
  const query = useQuery({
    queryKey: ['solicitud', id],
    queryFn: () => solicitudService.getSolicitudById(id),
    enabled: enabled && !!id && !isNaN(id),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  return {
    solicitud: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  };
}
