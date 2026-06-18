'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSolicitudStore } from '@/store';
import { solicitudService } from '@/services/solicitudService';

interface UseSolicitudesOptions {
  page?: number;
  size?: number;
  filters?: {
    status?: string;
    priority?: string;
    search?: string;
  };
}

export function useSolicitudes({
  page = 0,
  size = 10,
  filters = {},
}: UseSolicitudesOptions = {}) {
  const { setSolicitudes, setLoading, setError, clearError, setTotalElements } = useSolicitudStore();

  // Debounce search — status/priority apply immediately
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 150);
    return () => clearTimeout(t);
  }, [filters.search]);

  const effectiveFilters = {
    status: filters.status,
    priority: filters.priority,
    search: debouncedSearch,
  };

  const query = useQuery({
    queryKey: ['solicitudes', page, size, effectiveFilters],
    queryFn: () =>
      solicitudService.getSolicitudes({ page, size, ...effectiveFilters }),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
  });

  // Sync to Zustand store so other components can read current data
  useEffect(() => {
    if (query.data) {
      setSolicitudes(query.data.content);
      clearError();
      // Only update the total if we don't manipulate any status filter
      if (!effectiveFilters.status) {
        setTotalElements(query.data.totalElements);
      }
    }
  }, [query.data, setSolicitudes, clearError, setTotalElements, effectiveFilters.status]);

  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  useEffect(() => {
    if (query.error) {
      setError(query.error instanceof Error ? query.error.message : 'Error desconocido');
    }
  }, [query.error, setError]);

  return {
    solicitudes: query.data?.content ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    totalPages: query.data?.totalPages ?? 0,
    totalElements: query.data?.totalElements ?? 0,
    currentPage: page,
    refetch: query.refetch,
  };
}
