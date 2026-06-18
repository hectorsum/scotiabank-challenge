import { render } from '@testing-library/react'
import { LoadingSkeleton } from '@/components/ui'

describe('LoadingSkeleton', () => {
  test('renderiza elementos de skeleton y el texto de carga', () => {
    const { container, getByText } = render(<LoadingSkeleton />)
    expect(container.querySelectorAll('.gs-skel').length).toBeGreaterThan(0)
    expect(getByText(/Cargando solicitudes/i)).toBeInTheDocument()
  })
})
