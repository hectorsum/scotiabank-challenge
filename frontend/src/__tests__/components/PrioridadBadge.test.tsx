import { render, screen } from '@testing-library/react'
import { PrioridadBadge } from '@/components/ui'

describe('PrioridadBadge', () => {
  test('muestra la etiqueta correcta para cada prioridad', () => {
    const cases = [
      { priority: 'baja' as const,    label: 'Baja' },
      { priority: 'media' as const,   label: 'Media' },
      { priority: 'alta' as const,    label: 'Alta' },
      { priority: 'crítica' as const, label: 'Crítica' },
    ]

    cases.forEach(({ priority, label }) => {
      const { unmount } = render(<PrioridadBadge priority={priority} />)
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    })
  })
})
