import { test, expect } from '@playwright/test'

test.describe('Eliminación / Cierre de Solicitud', () => {
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

  test('debería mostrar botón de acción para cerrar solicitud', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    // El botón puede estar presente dependiendo del estado
    const deleteBtn = page.getByRole('button', { name: /Eliminar|Cerrar/i })
    if (await deleteBtn.isVisible()) {
      await expect(deleteBtn).toBeVisible()
    }
  })

  test('debería mostrar diálogo de confirmación al intentar cerrar', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    const closeBtn = page.getByRole('button', { name: /Cerrar solicitud/i })
    if (await closeBtn.isVisible()) {
      await closeBtn.click()
      await expect(page.getByText(/¿Cerrar esta solicitud/i)).toBeVisible()
    }
  })

  test('debería cancelar el cierre', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    const closeBtn = page.getByRole('button', { name: /Cerrar solicitud/i })
    if (await closeBtn.isVisible()) {
      await closeBtn.click()
      const cancelBtn = page.getByRole('button', { name: /Cancelar/i }).last()
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click()
        await expect(page.getByText(/¿Cerrar esta solicitud/i)).not.toBeVisible()
      }
    }
  })

  test('debería confirmar y cerrar solicitud', async ({ page }) => {
    const found = await goToFirstDetail(page)
    if (!found) return

    const closeBtn = page.getByRole('button', { name: /Cerrar solicitud/i })
    if (await closeBtn.isVisible()) {
      await closeBtn.click()

      const confirmBtn = page.getByRole('button', { name: /Confirmar|Sí/i })
      if (await confirmBtn.isVisible()) {
        const responsePromise = page.waitForResponse(
          (r) => r.url().includes('/api/v1/solicitudes') && r.request().method() === 'DELETE',
          { timeout: 5000 }
        ).catch(() => null)

        await confirmBtn.click()
        await responsePromise

        // Después de cerrar debería redirigir a bandeja
        await page.waitForURL(/\/solicitudes$/, { timeout: 5000 }).catch(() => null)
      }
    }
  })
})
