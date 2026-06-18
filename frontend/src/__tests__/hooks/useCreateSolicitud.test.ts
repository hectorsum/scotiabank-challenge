import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { useCreateSolicitud } from '@/hooks'
import { solicitudService } from '@/services/solicitudService'

jest.mock('@/services/solicitudService', () => ({
  solicitudService: { createSolicitud: jest.fn() },
}))

jest.mock('@/store', () => ({
  useSolicitudStore: jest.fn(() => ({ addSolicitud: jest.fn(), pagination: { totalElements: 0 } })),
  useUIStore: jest.fn(() => ({ showNotification: jest.fn() })),
}))

const mockSolicitud = {
  id: 1, title: 'Nueva', description: 'Desc', requester: 'User',
  category: 'Infraestructura', priority: 'media' as const, status: 'pendiente' as const,
  creationDate: '2024-01-01T00:00:00Z', lastChangeDate: '2024-01-01T00:00:00Z',
}

function wrapper() {
  const qc = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children)
}

describe('useCreateSolicitud', () => {
  beforeEach(() => jest.clearAllMocks())

  test('crea solicitud y pone success en true', async () => {
    ;(solicitudService.createSolicitud as jest.Mock).mockResolvedValue(mockSolicitud)

    const { result } = renderHook(() => useCreateSolicitud(), { wrapper: wrapper() })

    await act(async () => {
      await result.current.create({
        title: 'Nueva', description: 'Desc', requester: 'User',
        category: 'Infraestructura', priority: 'media',
      })
    })

    await waitFor(() => expect(result.current.success).toBe(true))
    expect(result.current.error).toBeNull()
  })

  test('reset limpia el estado de la mutación', async () => {
    ;(solicitudService.createSolicitud as jest.Mock).mockResolvedValue(mockSolicitud)

    const { result } = renderHook(() => useCreateSolicitud(), { wrapper: wrapper() })

    await act(async () => {
      await result.current.create({ title: 'Nueva', description: 'Desc', requester: 'User', category: 'Infraestructura', priority: 'media' })
    })

    act(() => result.current.reset())

    expect(result.current.success).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
