import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { useSolicitud } from '@/hooks'
import { solicitudService } from '@/services/solicitudService'

jest.mock('@/services/solicitudService', () => ({
  solicitudService: { getSolicitudById: jest.fn() },
}))

jest.mock('@/store', () => ({
  useSolicitudStore: jest.fn(() => ({
    setSolicitudes: jest.fn(), setLoading: jest.fn(), setError: jest.fn(), clearError: jest.fn(), setTotalElements: jest.fn(),
  })),
}))

const mockSolicitud = {
  id: 5, title: 'Solicitud X', description: 'Desc', requester: 'John',
  category: 'Infraestructura', priority: 'media' as const, status: 'pendiente' as const,
  creationDate: '2024-01-01T00:00:00Z', lastChangeDate: '2024-01-01T00:00:00Z',
}

function wrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children)
}

describe('useSolicitud', () => {
  beforeEach(() => jest.clearAllMocks())

  test('carga la solicitud por id y la expone en el hook', async () => {
    ;(solicitudService.getSolicitudById as jest.Mock).mockResolvedValue(mockSolicitud)

    const { result } = renderHook(() => useSolicitud(5), { wrapper: wrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.solicitud?.id).toBe(5)
    expect(result.current.solicitud?.title).toBe('Solicitud X')
    expect(result.current.error).toBeNull()
  })

  test('no hace llamada al servicio si el id es NaN', () => {
    renderHook(() => useSolicitud(NaN), { wrapper: wrapper() })
    expect(solicitudService.getSolicitudById).not.toHaveBeenCalled()
  })
})
