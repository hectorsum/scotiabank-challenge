'use client';

import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Form } from '@/components/pages/Form';
import { useCreateSolicitud } from '@/hooks';
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

export default function NuevaPage() {
  const router = useRouter();
  const { create, loading } = useCreateSolicitud();
  const { pagination } = useSolicitudStore();

  const handleNavigate = (page: Page) => {
    if (page === 'dashboard') router.push('/');
    else if (page === 'bandeja') router.push('/solicitudes');
  };

  const handleSubmit = async (values: FormValues) => {
    await create({
      title: values.title,
      description: values.description,
      requester: values.requester,
      category: values.category as Category,
      priority: values.priority,
    });
    router.push('/solicitudes');
  };

  return (
    <AppLayout
      currentPage="crear"
      totalRequests={pagination.totalElements}
      isLoading={loading}
      onNavigate={handleNavigate}
      onReload={() => {}}
    >
      <Form
        mode="crear"
        isSubmitting={loading}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/solicitudes')}
      />
    </AppLayout>
  );
}
