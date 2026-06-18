'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Bandeja } from '@/components/pages/Bandeja';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useSolicitudes } from '@/hooks';
import { useSolicitudStore } from '@/store';
import { solicitudService } from '@/services/solicitudService';
import type { Status, Priority } from '@/types';

type Page = 'dashboard' | 'bandeja' | 'crear' | 'detalle';
type SortBy = 'recientes' | 'antiguos' | 'prioridad' | 'titulo';

interface Filters {
  status: Status | 'todos';
  priority: Priority | 'todos';
  search: string;
  sortBy: SortBy;
}

const ALL_STATUSES: Status[] = [
  'pendiente', 'en revisión', 'aprobada', 'rechazada', 'cerrada',
];

const PRIORITY_RANK: Record<Priority, number> = {
  'crítica': 4, 'alta': 3, 'media': 2, 'baja': 1,
};

function BandejaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pagination } = useSolicitudStore();

  const initialStatus = (searchParams.get('status') as Status | null) ?? 'todos';

  const [filters, setFilters] = useState<Filters>({
    status: ALL_STATUSES.includes(initialStatus as Status) ? initialStatus : 'todos',
    priority: 'todos',
    search: '',
    sortBy: 'recientes',
  });

  const sharedFilters = {
    priority: filters.priority !== 'todos' ? filters.priority : undefined,
    search: filters.search || undefined,
  };

  // Query para los conteos de solicitudes - sin filtro de status para ver todos los estados
  const { data: countData } = useQuery({
    queryKey: ['solicitudes-counts', sharedFilters],
    queryFn: () => solicitudService.getSolicitudes({ page: 0, size: 200, ...sharedFilters }),
    staleTime: 30 * 1000,
  });

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = (countData?.content ?? []).filter((x) => x.status === s).length;
    return acc;
  }, {} as Record<Status, number>);

  const grandTotal = countData?.totalElements ?? pagination.totalElements;

  // Query principal con todos los filtros incluyendo status
  const { solicitudes, loading, error, refetch } = useSolicitudes({
    page: 0,
    size: 50,
    filters: {
      ...sharedFilters,
      status: filters.status !== 'todos' ? filters.status : undefined,
    },
  });

  const sorted = [...solicitudes].sort((a, b) => {
    switch (filters.sortBy) {
      case 'antiguos':
        return new Date(a.lastChangeDate).getTime() - new Date(b.lastChangeDate).getTime();
      case 'titulo':
        return a.title.localeCompare(b.title);
      case 'prioridad':
        return (PRIORITY_RANK[b.priority] ?? 0) - (PRIORITY_RANK[a.priority] ?? 0);
      default:
        return new Date(b.lastChangeDate).getTime() - new Date(a.lastChangeDate).getTime();
    }
  });

  const handleNavigate = (page: Page) => {
    if (page === 'dashboard') router.push('/');
    else if (page === 'crear') router.push('/solicitudes/nueva');
  };

  return (
    <AppLayout
      currentPage="bandeja"
      totalRequests={grandTotal}
      isLoading={loading}
      onNavigate={handleNavigate}
      onReload={() => { void refetch(); }}
    >
      {error ? (
        <ErrorState
          message={error}
          endpoint="GET /api/v1/solicitudes"
          onRetry={() => { void refetch(); }}
        />
      ) : (
        <Bandeja
          solicitudes={sorted}
          filters={filters}
          counts={counts}
          total={grandTotal}
          onFilterChange={(partial) =>
            setFilters((prev) => ({ ...prev, ...partial }))
          }
          onClearFilters={() =>
            setFilters({ status: 'todos', priority: 'todos', search: '', sortBy: 'recientes' })
          }
          onRowClick={(id) => router.push(`/solicitudes/${id}`)}
        />
      )}
    </AppLayout>
  );
}

export default function BandejaPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BandejaContent />
    </Suspense>
  );
}
