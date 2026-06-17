import { create } from 'zustand';
import type { Solicitud } from '@/types';

export interface SolicitudFilters {
  status?: string;
  priority?: string;
  search?: string;
}

export interface SolicitudPagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SolicitudStore {
  solicitudes: Solicitud[];
  loading: boolean;
  error: string | null;
  filters: SolicitudFilters;
  pagination: SolicitudPagination;

  setSolicitudes: (solicitudes: Solicitud[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<SolicitudFilters>) => void;
  setPage: (page: number) => void;
  clearError: () => void;
  resetFilters: () => void;
  addSolicitud: (solicitud: Solicitud) => void;
  updateSolicitudInList: (id: number, solicitud: Solicitud) => void;
  removeSolicitudFromList: (id: number) => void;
}

const initialPagination: SolicitudPagination = {
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
};

export const useSolicitudStore = create<SolicitudStore>((set) => ({
  solicitudes: [],
  loading: false,
  error: null,
  filters: {},
  pagination: { ...initialPagination },

  setSolicitudes: (solicitudes) => set({ solicitudes }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 0 },
    })),

  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, page },
    })),

  clearError: () => set({ error: null }),

  resetFilters: () =>
    set({ filters: {}, pagination: { ...initialPagination } }),

  addSolicitud: (solicitud) =>
    set((state) => ({
      solicitudes: [solicitud, ...state.solicitudes],
      pagination: {
        ...state.pagination,
        totalElements: state.pagination.totalElements + 1,
      },
    })),

  updateSolicitudInList: (id, solicitud) =>
    set((state) => ({
      solicitudes: state.solicitudes.map((s) => (s.id === id ? solicitud : s)),
    })),

  removeSolicitudFromList: (id) =>
    set((state) => ({
      solicitudes: state.solicitudes.filter((s) => s.id !== id),
      pagination: {
        ...state.pagination,
        totalElements: state.pagination.totalElements - 1,
      },
    })),
}));

export default useSolicitudStore;
