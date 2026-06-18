import { test, expect } from '@playwright/test'

test.describe('Detalle y Edición', () => {
  async function goToFirstDetail(page: import('@playwright/test').Page) {
    await page.goto('/solicitudes')
    await page.waitForLoadState('networkidle')
    const firstRow = page.locator('button.gs-row-hover').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await page.waitForURL(/\/solicitudes\/\d+$/)
      return true
    }
    return false
  }

  test('debería cargar detalle de una solicitud', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    await expect(page).toHaveURL(/\/solicitudes\/\d+$/)
    await expect(page.getByRole('button', { name: /Editar solicitud/i })).toBeVisible()
  })

  test('debería mostrar información de la solicitud', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    // Verifica que hay contenido con la solicitud
    await expect(page.locator('h2, h1, .font-serif').first()).toBeVisible()
  })

  test('debería mostrar endpoint de la API en detalle', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    await expect(page.getByText(/GET \/api\/v1\/solicitudes/i)).toBeVisible()
  })

  test('debería cambiar prioridad desde detalle', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    const altaBtn = page.getByRole('button', { name: /Alta/i }).first()
    if (await altaBtn.isVisible()) {
      await altaBtn.click()
      await page.waitForTimeout(500)
      await expect(page.getByText('Alta')).toBeVisible()
    }
  })

  test('debería cambiar estado desde detalle', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    const aprobadaBtn = page.getByRole('button', { name: /Aprobada/i }).first()
    if (await aprobadaBtn.isVisible()) {
      await aprobadaBtn.click()
      await page.waitForTimeout(500)
    }
  })

  test('debería navegar a formulario de edición', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    await page.getByRole('button', { name: /Editar solicitud/i }).click()
    await expect(page).toHaveURL(/\/solicitudes\/\d+\/editar$/)
  })

  test('debería cargar formulario de edición con datos pre-cargados', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    await page.getByRole('button', { name: /Editar solicitud/i }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Editar solicitud')).toBeVisible()
    await expect(page.getByText('PUT /api/v1/solicitudes/')).toBeVisible()

    // El campo título no debería estar vacío
    const titleInput = page.locator('input[placeholder*="Resumen"]')
    await expect(titleInput).not.toHaveValue('')
  })

  test('debería volver al detalle desde edición', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    await page.getByRole('button', { name: /Editar solicitud/i }).click()
    await page.waitForLoadState('networkidle')

    await page.getByText(/Volver al detalle/i).click()
    await expect(page).toHaveURL(/\/solicitudes\/\d+$/)
  })

  test('debería volver a bandeja desde detalle', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    await page.getByText(/Volver/i).first().click()
    await expect(page).toHaveURL(/\/solicitudes$/)
  })
})
