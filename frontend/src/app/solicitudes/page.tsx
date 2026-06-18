'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Bandeja } from '@/components/pages/Bandeja';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useSolicitudes } from '@/hooks';
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

  const initialStatus = (searchParams.get('status') as Status | null) ?? 'todos';

  const [filters, setFilters] = useState<Filters>({
    status: ALL_STATUSES.includes(initialStatus as Status) ? initialStatus : 'todos',
    priority: 'todos',
    search: '',
    sortBy: 'recientes',
  });

  const apiFilters = {
    status: filters.status !== 'todos' ? filters.status : undefined,
    priority: filters.priority !== 'todos' ? filters.priority : undefined,
    search: filters.search || undefined,
  };

  const { solicitudes, loading, error, totalElements, refetch } = useSolicitudes({
    page: 0,
    size: 50,
    filters: apiFilters,
  });

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = solicitudes.filter((x) => x.status === s).length;
    return acc;
  }, {} as Record<Status, number>);

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
      totalRequests={totalElements}
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
          total={totalElements}
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
