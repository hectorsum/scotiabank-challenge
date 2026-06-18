import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('debería cargar la página con el título correcto', async ({ page }) => {
    await expect(page).toHaveTitle(/Gestor de Solicitudes/)
  })

  test('debería mostrar el sidebar con navegación', async ({ page }) => {
    await expect(page.getByText('Resumen')).toBeVisible()
    await expect(page.getByText('Solicitudes')).toBeVisible()
  })

  test('debería mostrar distribución por estado', async ({ page }) => {
    await expect(page.getByText('Distribución por estado')).toBeVisible()
  })

  test('debería mostrar panel de requieren atención', async ({ page }) => {
    await expect(page.getByText('Requieren atención')).toBeVisible()
  })

  test('debería mostrar actividad reciente', async ({ page }) => {
    await expect(page.getByText('Actividad reciente')).toBeVisible()
  })

  test('debería navegar a bandeja al hacer clic en Solicitudes del sidebar', async ({ page }) => {
    await page.getByText('Solicitudes').click()
    await expect(page).toHaveURL(/\/solicitudes/)
  })

  test('debería navegar a bandeja filtrada al hacer clic en card de estado', async ({ page }) => {
    const pendienteCard = page.locator('button', { hasText: 'Pendiente' }).first()
    if (await pendienteCard.isVisible()) {
      await pendienteCard.click()
      await expect(page).toHaveURL(/\/solicitudes/)
    }
  })

  test('debería mostrar botón Nueva solicitud', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Nueva/i }).first()).toBeVisible()
  })
})
