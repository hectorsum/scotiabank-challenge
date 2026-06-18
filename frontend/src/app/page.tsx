'use client';

import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/components/pages/Dashboard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useSolicitudes } from '@/hooks';
import type { Status } from '@/types';

type Page = 'dashboard' | 'bandeja' | 'crear' | 'detalle';

const ALL_STATUSES: Status[] = [
  'pendiente', 'en revisión', 'aprobada', 'rechazada', 'cerrada',
];

export default function HomePage() {
  const router = useRouter();

  const { solicitudes, loading, error, totalElements, refetch } = useSolicitudes({
    page: 0,
    size: 20,
  });

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = solicitudes.filter((x) => x.status === s).length;
    return acc;
  }, {} as Record<Status, number>);

  const criticalCount = solicitudes.filter((s) => s.priority === 'crítica').length;

  const handleNavigate = (page: Page) => {
    if (page === 'bandeja') router.push('/solicitudes');
    else if (page === 'crear') router.push('/solicitudes/nueva');
  };

  return (
    <AppLayout
      currentPage="dashboard"
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
      ) : loading ? (
        <LoadingSkeleton />
      ) : (
        <Dashboard
          counts={counts}
          total={totalElements}
          criticalCount={criticalCount}
          recentItems={solicitudes.slice(0, 8)}
          onStatusCardClick={(status) =>
            router.push(`/solicitudes?status=${encodeURIComponent(status)}`)
          }
          onGoBandeja={() => router.push('/solicitudes')}
          onItemClick={(id) => router.push(`/solicitudes/${id}`)}
        />
      )}
    </AppLayout>
  );
}
