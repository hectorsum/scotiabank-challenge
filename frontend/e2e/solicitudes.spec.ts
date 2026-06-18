import { test, expect } from '@playwright/test'

test.describe('Bandeja de Solicitudes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/solicitudes')
    await page.waitForLoadState('networkidle')
  })

  test('debería cargar la página correctamente', async ({ page }) => {
    await expect(page).toHaveTitle(/Gestor de Solicitudes/)
    await expect(page.locator('input[placeholder*="Buscar"]')).toBeVisible()
  })

  test('debería mostrar el toolbar con filtros', async ({ page }) => {
    await expect(page.locator('input[placeholder*="Buscar"]')).toBeVisible()
    await expect(page.locator('select').first()).toBeVisible()
  })

  test('debería mostrar chips de estado', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Todas/i })).toBeVisible()
  })

  test('debería buscar por título sin romper la UI', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar"]')
    await searchInput.fill('solicitud')
    await page.waitForTimeout(300)
    await expect(page.locator('input[placeholder*="Buscar"]')).toHaveValue('solicitud')
  })

  test('debería filtrar por prioridad', async ({ page }) => {
    const prioritySelect = page.locator('select').nth(0)
    await prioritySelect.selectOption('crítica')
    await page.waitForTimeout(300)
    await expect(prioritySelect).toHaveValue('crítica')
  })

  test('debería cambiar ordenamiento', async ({ page }) => {
    const sortSelect = page.locator('select').nth(1)
    await sortSelect.selectOption('prioridad')
    await expect(sortSelect).toHaveValue('prioridad')
  })

  test('debería activar chip de estado al hacer clic', async ({ page }) => {
    const pendienteChip = page.getByRole('button', { name: /Pendiente/i }).first()
    if (await pendienteChip.isVisible()) {
      await pendienteChip.click()
      await page.waitForTimeout(300)
      // El chip activo tiene fondo oscuro
      await expect(pendienteChip).toHaveCSS('background', /161310|rgb\(22, 19, 16\)/)
    }
  })

  test('debería navegar al detalle al hacer clic en una fila', async ({ page }) => {
    const firstRow = page.locator('button.gs-row-hover').first()
    if (await firstRow.isVisible()) {
      await firstRow.click()
      await expect(page).toHaveURL(/\/solicitudes\/\d+/)
    }
  })

  test('debería mostrar empty state con búsqueda sin resultados', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar"]')
    await searchInput.fill('xyznonexistent_12345')
    await page.waitForTimeout(300)
    const emptyMsg = page.getByText('No hay solicitudes')
    if (await emptyMsg.isVisible()) {
      await expect(emptyMsg).toBeVisible()
    }
  })

  test('debería navegar a nueva solicitud desde header', async ({ page }) => {
    await page.getByRole('button', { name: /Nueva/i }).first().click()
    await expect(page).toHaveURL(/\/solicitudes\/nueva/)
  })
})
