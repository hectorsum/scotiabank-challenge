const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

export const apiConfig = {
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  SOLICITUDES: '/api/v1/solicitudes',
  SOLICITUD_DETAIL: (id: number) => `/api/v1/solicitudes/${id}`,
  SOLICITUD_UPDATE_PRIORITY: (id: number) => `/api/v1/solicitudes/${id}/priority`,
};