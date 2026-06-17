import { AxiosError } from 'axios';
import { apiClient } from './api';
import { API_ENDPOINTS } from '@/config/api';
import type {
  Solicitud,
  CreateSolicitudDTO,
  UpdateSolicitudDTO,
  PaginatedResponse,
  Priority,
  ApiError,
} from '@/types';

interface GetSolicitudesParams {
  page?: number;
  size?: number;
  status?: string;
  priority?: string;
  search?: string;
}

export async function getSolicitudes(
  params: GetSolicitudesParams = {}
): Promise<PaginatedResponse<Solicitud>> {
  try {
    const { data } = await apiClient.get<PaginatedResponse<Solicitud>>(
      API_ENDPOINTS.SOLICITUDES,
      {
        params: {
          page: params.page ?? 0,
          size: params.size ?? 10,
          ...(params.status !== undefined && { status: params.status }),
          ...(params.priority !== undefined && { priority: params.priority }),
          ...(params.search !== undefined && { search: params.search }),
        },
      }
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function getSolicitudById(id: number): Promise<Solicitud> {
  try {
    const { data } = await apiClient.get<Solicitud>(
      API_ENDPOINTS.SOLICITUD_DETAIL(id)
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function createSolicitud(
  solicitud: CreateSolicitudDTO
): Promise<Solicitud> {
  try {
    const { data } = await apiClient.post<Solicitud>(
      API_ENDPOINTS.SOLICITUDES,
      solicitud
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function updateSolicitud(
  id: number,
  solicitud: UpdateSolicitudDTO
): Promise<Solicitud> {
  try {
    const { data } = await apiClient.put<Solicitud>(
      API_ENDPOINTS.SOLICITUD_DETAIL(id),
      solicitud
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function updatePriority(
  id: number,
  priority: Priority
): Promise<Solicitud> {
  try {
    const { data } = await apiClient.patch<Solicitud>(
      API_ENDPOINTS.SOLICITUD_UPDATE_PRIORITY(id),
      { priority }
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function deleteSolicitud(id: number): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.SOLICITUD_DETAIL(id));
  } catch (error) {
    throw handleError(error);
  }
}

function handleError(error: unknown): Error {
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const apiError = error.response.data as ApiError;
      const message = apiError?.message ?? getStatusMessage(status);
      const err = new Error(message);
      (err as Error & { status: number }).status = status;
      return err;
    }
    if (error.request) {
      return new Error(
        'No se pudo conectar al servidor. Verifica tu conexión de red.'
      );
    }
  }
  return new Error('Ocurrió un error inesperado');
}

function getStatusMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Solicitud inválida. Verifica los datos enviados.',
    401: 'No autorizado.',
    403: 'Acceso denegado.',
    404: 'Solicitud no encontrada.',
    409: 'Conflicto. Los datos ya existen o están en conflicto.',
    500: 'Error interno del servidor. Intenta más tarde.',
    503: 'Servidor no disponible. Intenta más tarde.',
  };
  return messages[status] ?? 'Error al procesar la solicitud.';
}

export const solicitudService = {
  getSolicitudes,
  getSolicitudById,
  createSolicitud,
  updateSolicitud,
  updatePriority,
  deleteSolicitud,
};

export default solicitudService;
