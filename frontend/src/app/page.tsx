'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/components/pages/Dashboard';
import type { Status } from '@/types';

export default function Home() {
  const counts: Record<Status, number> = {
    'pendiente':   0,
    'en revisión': 0,
    'aprobada':    0,
    'rechazada':   0,
    'cerrada':     0,
  };

  return (
    <AppLayout
      currentPage="dashboard"
      totalRequests={0}
      onNavigate={(page) => console.log('navigate to', page)}
      onReload={() => console.log('reload')}
    >
      <Dashboard
        counts={counts}
        total={0}
        criticalCount={0}
        recentItems={[]}
        onStatusCardClick={(status) => console.log('filter by', status)}
        onGoBandeja={() => console.log('go bandeja')}
        onItemClick={(id) => console.log('open', id)}
      />
    </AppLayout>
  );
}
