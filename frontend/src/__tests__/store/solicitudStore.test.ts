import { useSolicitudStore } from '@/store'
import type { Category } from '@/types'

const base = {
  id: 1, title: 'Test', description: 'Desc', requester: 'User',
  category: 'Infraestructura' as Category, priority: 'media' as const, status: 'pendiente' as const,
  creationDate: '2024-01-01T00:00:00Z', lastChangeDate: '2024-01-01T00:00:00Z',
}

describe('solicitudStore', () => {
  beforeEach(() => {
    useSolicitudStore.setState({
      solicitudes: [], loading: false, error: null, filters: {},
      pagination: { page: 0, size: 10, totalElements: 0, totalPages: 0 },
    })
  })

  test('addSolicitud inserta al inicio y suma el totalElements', () => {
    useSolicitudStore.setState({ pagination: { page: 0, size: 10, totalElements: 3, totalPages: 1 } })

    useSolicitudStore.getState().addSolicitud(base)

    expect(useSolicitudStore.getState().solicitudes[0]?.id).toBe(1)
    expect(useSolicitudStore.getState().pagination.totalElements).toBe(4)
  })

  test('updateSolicitudInList reemplaza solo el item con el id correcto', () => {
    useSolicitudStore.getState().setSolicitudes([base, { ...base, id: 2, title: 'Otro' }])

    useSolicitudStore.getState().updateSolicitudInList(1, { ...base, status: 'aprobada' })

    const { solicitudes } = useSolicitudStore.getState()
    expect(solicitudes[0]?.status).toBe('aprobada')
    expect(solicitudes[1]?.title).toBe('Otro') // el otro no cambia
  })

  test('removeSolicitudFromList elimina el item y resta el totalElements', () => {
    useSolicitudStore.setState({ pagination: { page: 0, size: 10, totalElements: 2, totalPages: 1 } })
    useSolicitudStore.getState().setSolicitudes([base])

    useSolicitudStore.getState().removeSolicitudFromList(1)

    expect(useSolicitudStore.getState().solicitudes).toEqual([])
    expect(useSolicitudStore.getState().pagination.totalElements).toBe(1)
  })

  test('setError y clearError gestionan el estado de error', () => {
    useSolicitudStore.getState().setError('Fallo de red')
    expect(useSolicitudStore.getState().error).toBe('Fallo de red')

    useSolicitudStore.getState().clearError()
    expect(useSolicitudStore.getState().error).toBeNull()
  })
})
