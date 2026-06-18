import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { useSolicitudes } from '@/hooks'
import { solicitudService } from '@/services/solicitudService'

jest.mock('@/services/solicitudService', () => ({
  solicitudService: { getSolicitudes: jest.fn() },
}))

jest.mock('@/store', () => ({
  useSolicitudStore: jest.fn(() => ({
    setSolicitudes: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    clearError: jest.fn(),
    setTotalElements: jest.fn(),
  })),
}))

const mockPage = {
  content: [
    { id: 1, title: 'Test', description: 'Desc', requester: 'John', category: 'Infraestructura', priority: 'media' as const, status: 'pendiente' as const, creationDate: '2024-01-01T00:00:00Z', lastChangeDate: '2024-01-01T00:00:00Z' },
  ],
  totalElements: 1,
  totalPages: 1,
  currentPage: 0,
  pageSize: 10,
}

function wrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children)
}

describe('useSolicitudes', () => {
  beforeEach(() => jest.clearAllMocks())

  test('devuelve las solicitudes cuando el servicio responde OK', async () => {
    ;(solicitudService.getSolicitudes as jest.Mock).mockResolvedValue(mockPage)

    const { result } = renderHook(() => useSolicitudes({ page: 0, size: 10 }), { wrapper: wrapper() })

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.solicitudes).toEqual(mockPage.content)
    expect(result.current.totalElements).toBe(1)
    expect(result.current.error).toBeNull()
  })

  test('pasa los filtros al servicio correctamente', async () => {
    ;(solicitudService.getSolicitudes as jest.Mock).mockResolvedValue(mockPage)

    renderHook(
      () => useSolicitudes({ filters: { status: 'pendiente', priority: 'alta' } }),
      { wrapper: wrapper() }
    )

    await waitFor(() => expect(solicitudService.getSolicitudes).toHaveBeenCalled())

    expect(solicitudService.getSolicitudes).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'pendiente', priority: 'alta' })
    )
  })
})
