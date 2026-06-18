import { renderHook, act } from '@testing-library/react'
import { useForm } from '@/hooks'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
})

type FormValues = z.infer<typeof schema>
const initialValues: FormValues = { title: '', description: '' }

describe('useForm', () => {
  test('isValid es false con valores vacíos y true cuando son correctos', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, schema, onSubmit: jest.fn() })
    )

    expect(result.current.isValid).toBe(false)

    act(() => {
      result.current.setFieldValue('title', 'Título válido')
      result.current.setFieldValue('description', 'Descripción suficientemente larga')
    })

    expect(result.current.isValid).toBe(true)
  })

  test('handleSubmit llama onSubmit solo si el formulario es válido', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useForm({ initialValues, schema, onSubmit }))

    // Intento con valores inválidos — no debe llamar onSubmit
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>)
    })
    expect(onSubmit).not.toHaveBeenCalled()

    // Rellenar y reenviar
    act(() => {
      result.current.setFieldValue('title', 'Título válido')
      result.current.setFieldValue('description', 'Descripción suficientemente larga')
    })

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>)
    })
    expect(onSubmit).toHaveBeenCalledWith({ title: 'Título válido', description: 'Descripción suficientemente larga' })
  })

  test('handleBlur marca el campo touched y muestra el error', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, schema, onSubmit: jest.fn() })
    )

    act(() => {
      result.current.handleBlur({ target: { name: 'title' } } as React.FocusEvent<HTMLInputElement>)
    })

    expect(result.current.touched.title).toBe(true)
    expect(result.current.errors.title).toBeTruthy()
  })

  test('reset restaura el estado inicial completo', () => {
    const { result } = renderHook(() =>
      useForm({ initialValues, schema, onSubmit: jest.fn() })
    )

    act(() => {
      result.current.setFieldValue('title', 'Algo')
      result.current.setFieldError('title', 'Error manual')
      result.current.reset()
    })

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
  })
})
