'use client';

import { useRouter, useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Detalle } from '@/components/pages/Detalle';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useSolicitud, useUpdateSolicitud } from '@/hooks';
import type { Solicitud, Status, Priority, UpdateSolicitudDTO } from '@/types';

type Page = 'dashboard' | 'bandeja' | 'crear' | 'detalle';

function toDTO(s: Solicitud, overrides: Partial<UpdateSolicitudDTO> = {}): UpdateSolicitudDTO {
  return {
    title: s.title,
    description: s.description,
    requester: s.requester,
    category: s.category,
    priority: s.priority,
    status: s.status,
    ...overrides,
  };
}

export default function DetallePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { solicitud, loading, error, refetch } = useSolicitud(id);
  const { update, updatePriority } = useUpdateSolicitud(id);

  const handleNavigate = (page: Page) => {
    if (page === 'dashboard') router.push('/');
    else if (page === 'bandeja') router.push('/solicitudes');
    else if (page === 'crear') router.push('/solicitudes/nueva');
  };

  return (
    <AppLayout
      currentPage="detalle"
      isLoading={loading}
      onNavigate={handleNavigate}
      onReload={() => { void refetch(); }}
    >
      {error ? (
        <ErrorState
          message={error}
          endpoint={`GET /api/v1/solicitudes/${id}`}
          onRetry={() => { void refetch(); }}
        />
      ) : loading || !solicitud ? (
        <LoadingSkeleton />
      ) : (
        <Detalle
          solicitud={solicitud}
          onBack={() => router.push('/solicitudes')}
          onEdit={() => router.push(`/solicitudes/${id}/editar`)}
          onPriorityChange={(priority: Priority) => { void updatePriority(priority); }}
          onStatusChange={(status: Status) => { void update(toDTO(solicitud, { status })); }}
          onClose={async () => {
            await update(toDTO(solicitud, { status: 'cerrada' }));
            router.push('/solicitudes');
          }}
        />
      )}
    </AppLayout>
  );
}
