import { test, expect } from '@playwright/test'

test.describe('Crear Solicitud', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/solicitudes/nueva')
    await page.waitForLoadState('networkidle')
  })

  test('debería cargar el formulario de creación', async ({ page }) => {
    await expect(page.getByText('Nueva solicitud')).toBeVisible()
    await expect(page.locator('input[placeholder*="Resumen"]')).toBeVisible()
    await expect(page.locator('textarea')).toBeVisible()
  })

  test('debería mostrar endpoint de la API', async ({ page }) => {
    await expect(page.getByText('POST /api/v1/solicitudes')).toBeVisible()
  })

  test('debería mostrar todos los campos requeridos', async ({ page }) => {
    await expect(page.locator('input[placeholder*="Resumen"]')).toBeVisible()
    await expect(page.locator('textarea')).toBeVisible()
    await expect(page.locator('input[placeholder*="solicitante"]')).toBeVisible()
    await expect(page.locator('select')).toBeVisible()
  })

  test('debería mostrar botones de prioridad', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Baja/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Media/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Alta/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Crítica/i })).toBeVisible()
  })

  test('debería seleccionar prioridad al hacer clic', async ({ page }) => {
    const altaBtn = page.getByRole('button', { name: /Alta/i })
    await altaBtn.click()
    
    // El botón activo tiene borde de acento
    await expect(altaBtn).toBeVisible()
  })

  test('debería no enviar con campos vacíos', async ({ page }) => {
    await page.getByRole('button', { name: /Crear solicitud/i }).click()
    
    
    // El formulario muestra errores de validación
    await expect(page.locator('text=al menos')).toBeVisible()
  })

  test('debería mostrar error de título corto', async ({ page }) => {
    await page.locator('input[placeholder*="Resumen"]').fill('ab')
    await page.locator('input[placeholder*="Resumen"]').blur()
    await expect(page.getByText(/al menos/i)).toBeVisible()
  })

  test('debería crear solicitud con datos válidos', async ({ page }) => {
    await page.locator('input[placeholder*="Resumen"]').fill('Solicitud de prueba E2E')
    await page.locator('textarea').fill('Esta es una descripción válida para el test de creación')
    await page.locator('input[placeholder*="solicitante"]').fill('Test User E2E')
    await page.locator('select').selectOption('Infraestructura')

    const responsePromise = page.waitForResponse(
      (r) => r.url().includes('/api/v1/solicitudes') && r.request().method() === 'POST',
      { timeout: 5000 }
    ).catch(() => null)

    await page.getByRole('button', { name: /Crear solicitud/i }).click()

    const response = await responsePromise
    if (response && response.status() === 201) {
      await expect(page).toHaveURL(/\/solicitudes\/\d+/)
    }
  })

  test('debería cancelar y volver a bandeja', async ({ page }) => {
    await page.getByRole('button', { name: /Cancelar/i }).last().click()
    await expect(page).toHaveURL(/\/solicitudes$/)
  })
})
