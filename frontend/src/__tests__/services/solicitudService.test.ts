import { getSolicitudes, getSolicitudById, createSolicitud, deleteSolicitud } from '@/services/solicitudService'
import { apiClient } from '@/services/api'

jest.mock('@/services/api', () => ({
  apiClient: { get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
  default:   { get: jest.fn(), post: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}))

const mockSolicitud = {
  id: 1, title: 'Test', description: 'Desc', requester: 'John',
  category: 'Infraestructura', priority: 'media' as const, status: 'pendiente' as const,
  creationDate: '2024-01-01T00:00:00Z', lastChangeDate: '2024-01-01T00:00:00Z',
}

describe('solicitudService', () => {
  beforeEach(() => jest.clearAllMocks())

  test('getSolicitudes hace GET a /api/v1/solicitudes con los params correctos', async () => {
    ;(apiClient.get as jest.Mock).mockResolvedValue({
      data: { content: [mockSolicitud], totalElements: 1, totalPages: 1, currentPage: 0, pageSize: 10 },
    })

    const result = await getSolicitudes({ status: 'pendiente', priority: 'alta' })

    expect(result.content).toEqual([mockSolicitud])
    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/v1/solicitudes',
      expect.objectContaining({ params: expect.objectContaining({ status: 'pendiente', priority: 'alta' }) })
    )
  })

  test('getSolicitudById hace GET a /api/v1/solicitudes/:id', async () => {
    ;(apiClient.get as jest.Mock).mockResolvedValue({ data: mockSolicitud })

    const result = await getSolicitudById(1)

    expect(result.id).toBe(1)
    expect(apiClient.get).toHaveBeenCalledWith('/api/v1/solicitudes/1')
  })

  test('getSolicitudById lanza error legible en 404', async () => {
    const { AxiosError } = jest.requireActual('axios')
    const err = new AxiosError('Not found')
    err.response = { status: 404, data: { message: 'Solicitud no encontrada.' } }
    ;(apiClient.get as jest.Mock).mockRejectedValue(err)

    await expect(getSolicitudById(999)).rejects.toThrow('Solicitud no encontrada.')
  })

  test('createSolicitud hace POST y retorna la solicitud creada', async () => {
    ;(apiClient.post as jest.Mock).mockResolvedValue({ data: mockSolicitud })

    const result = await createSolicitud({
      title: 'Test', description: 'Desc', requester: 'John',
      category: 'Infraestructura', priority: 'media',
    })

    expect(result.id).toBe(1)
    expect(apiClient.post).toHaveBeenCalledWith('/api/v1/solicitudes', expect.any(Object))
  })

  test('deleteSolicitud hace DELETE y resuelve sin contenido', async () => {
    ;(apiClient.delete as jest.Mock).mockResolvedValue({})

    await expect(deleteSolicitud(1)).resolves.toBeUndefined()
    expect(apiClient.delete).toHaveBeenCalledWith('/api/v1/solicitudes/1')
  })
})
