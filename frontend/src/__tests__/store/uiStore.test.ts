import { useUIStore } from '@/store'

describe('uiStore', () => {
  beforeEach(() => useUIStore.setState({ sidebarOpen: true, notification: null }))

  test('toggleSidebar alterna el estado del sidebar', () => {
    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarOpen).toBe(false)

    useUIStore.getState().toggleSidebar()
    expect(useUIStore.getState().sidebarOpen).toBe(true)
  })

  test('showNotification crea una notificación con tipo y mensaje', () => {
    useUIStore.getState().showNotification('success', 'Solicitud creada')

    const { notification } = useUIStore.getState()
    expect(notification?.type).toBe('success')
    expect(notification?.message).toBe('Solicitud creada')
    expect(notification?.id).toBeTruthy()
  })

  test('hideNotification elimina la notificación activa', () => {
    useUIStore.getState().showNotification('error', 'Algo salió mal')
    useUIStore.getState().hideNotification()
    expect(useUIStore.getState().notification).toBeNull()
  })
})
