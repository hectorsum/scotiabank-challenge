'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toast } from '../ui/Toast';
import { useUIStore } from '@/store';

type Page = 'dashboard' | 'bandeja' | 'crear' | 'detalle';
type ApiStatus = 'ok' | 'error';

const PAGE_META: Record<Page, { title: string; crumb: string }> = {
  dashboard: { title: 'Resumen',                crumb: 'Panel' },
  bandeja:   { title: 'Bandeja de solicitudes', crumb: 'Solicitudes' },
  crear:     { title: 'Nueva solicitud',        crumb: 'Solicitudes / crear' },
  detalle:   { title: 'Detalle',                crumb: 'Solicitudes / detalle' },
};

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  pageTitle?: string;
  totalRequests?: number;
  isLoading?: boolean;
  onNavigate: (page: Page) => void;
  onReload?: () => void;
  orgName?: string;
}

export function AppLayout({
  children,
  currentPage,
  pageTitle,
  totalRequests = 0,
  isLoading = false,
  onNavigate,
  onReload,
  orgName = 'Operaciones internas',
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('ok');
  const { notification, hideNotification } = useUIStore();

  const meta = PAGE_META[currentPage];

  return (
    <div className="gs-scroll flex min-h-screen bg-bg-page font-sans text-fg-primary">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        totalRequests={totalRequests}
        apiStatus={apiStatus}
        onApiStatusChange={setApiStatus}
        onNavigate={onNavigate}
        orgName={orgName}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[55]"
          style={{ background: 'rgba(20,17,13,0.32)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="gs-main gs-scroll flex-1 min-w-0 flex flex-col">
        <Header
          pageTitle={pageTitle ?? meta.title}
          crumb={meta.crumb}
          onToggleSidebar={() => setSidebarOpen(true)}
          onReload={onReload ?? (() => {})}
          onNewRequest={() => onNavigate('crear')}
          isLoading={isLoading}
        />

        <div className="gs-content gs-scroll flex-1 px-7 pt-8 pb-[72px] overflow-y-auto">
          {children}
        </div>
      </div>

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onDismiss={hideNotification}
        />
      )}
    </div>
  );
}
