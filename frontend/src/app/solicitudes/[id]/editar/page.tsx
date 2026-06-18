'use client';

import { useRouter, useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Form } from '@/components/pages/Form';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useSolicitud, useUpdateSolicitud } from '@/hooks';
import { useSolicitudStore } from '@/store';
import type { Category, Priority, Status } from '@/types';

type Page = 'dashboard' | 'bandeja' | 'crear' | 'detalle';

interface FormValues {
  title: string;
  description: string;
  requester: string;
  category: string;
  priority: Priority;
  status: Status;
}

export default function EditarPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { solicitud, loading, error, refetch } = useSolicitud(id);
  const { update, loading: saving } = useUpdateSolicitud(id);
  const { pagination } = useSolicitudStore();

  const handleNavigate = (page: Page) => {
    if (page === 'dashboard') router.push('/');
    else if (page === 'bandeja') router.push('/solicitudes');
    else if (page === 'detalle') router.push(`/solicitudes/${id}`);
  };

  const handleSubmit = async (values: FormValues) => {
    await update({
      title: values.title,
      description: values.description,
      requester: values.requester,
      category: values.category as Category,
      priority: values.priority,
      status: values.status,
    });
    router.push(`/solicitudes/${id}`);
  };

  return (
    <AppLayout
      currentPage="crear"
      totalRequests={pagination.totalElements}
      isLoading={loading || saving}
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
        <Form
          mode="editar"
          initialValues={{
            title: solicitud.title,
            description: solicitud.description,
            requester: solicitud.requester,
            category: solicitud.category,
            priority: solicitud.priority,
            status: solicitud.status,
          }}
          isSubmitting={saving}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/solicitudes/${id}`)}
        />
      )}
    </AppLayout>
  );
}
