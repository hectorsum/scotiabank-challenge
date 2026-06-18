import { render, screen } from '@testing-library/react'
import { Toast } from '@/components/ui'

describe('Toast', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  test('muestra el mensaje recibido por props', () => {
    render(<Toast message="Solicitud creada correctamente" type="success" onDismiss={jest.fn()} />)
    expect(screen.getByText('Solicitud creada correctamente')).toBeInTheDocument()
  })

  test('llama onDismiss exactamente cuando expira el duration', () => {
    const onDismiss = jest.fn()
    render(<Toast message="Test" type="success" onDismiss={onDismiss} duration={2800} />)

    jest.advanceTimersByTime(2799)
    expect(onDismiss).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
