import axios, { AxiosError, AxiosInstance } from 'axios';
import { ApiError } from '@/types';
import { apiConfig } from '@/config/api';

export const apiClient: AxiosInstance = axios.create(apiConfig);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const errorMessage =
      error.response?.data?.message ??
      error.message ??
      'Error desconocido al conectar con el servidor';

    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        message: errorMessage,
        path: error.response?.data?.path,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
