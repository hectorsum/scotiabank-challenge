import { render, screen } from '@testing-library/react'
import { EstadoBadge } from '@/components/ui'

describe('EstadoBadge', () => {
  test('muestra la etiqueta correcta para cada estado', () => {
    const cases = [
      { status: 'pendiente' as const,    label: 'Pendiente' },
      { status: 'en revisión' as const,  label: 'En revisión' },
      { status: 'aprobada' as const,     label: 'Aprobada' },
      { status: 'rechazada' as const,    label: 'Rechazada' },
      { status: 'cerrada' as const,      label: 'Cerrada' },
    ]

    cases.forEach(({ status, label }) => {
      const { unmount } = render(<EstadoBadge status={status} />)
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    })
  })

  test('aplica clases distintas para tamaño sm vs md', () => {
    const { container: sm } = render(<EstadoBadge status="pendiente" size="sm" />)
    const { container: md } = render(<EstadoBadge status="pendiente" size="md" />)

    expect(sm.querySelector('span')?.className).toContain('text-[12px]')
    expect(md.querySelector('span')?.className).toContain('text-[12.5px]')
  })
})
