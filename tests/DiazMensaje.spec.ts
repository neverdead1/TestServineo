import { test, expect } from '@playwright/test';

// VERIFICAR mensaje cuando no hay items en el historial


test('MENSAJE DE NO HAY BUSQUEDAS', async ({ page }) => {

  // 1. Abrir la página
  await page.goto('https://servineo.app/es');

  // 2. Delay de 4s esperando que aparezca la ventana emergente
  await page.waitForTimeout(4000);

  // 3. Cerrar popup del Tour si aparece
  const closeTourBtn = page.locator('button.reactour__close-button');
  if (await closeTourBtn.isVisible()) {
    await closeTourBtn.click();
  }

  // 4. Click en "Ofertas de trabajo" (versión estable)
  await page
    .getByRole('navigation', { name: 'Menú principal' })
    .getByRole('link', { name: 'Ofertas de trabajo' })
    .click();

  // 5. Click en el input de búsqueda (border-input)
  await page.locator('.border-input').click();

  // 6. Click en el botón del ícono de limpiar (css: .ml-1)
  await page.locator('.ml-1').click();

  // 7. Assert: verificar que aparece el mensaje de “no hay búsquedas”
  await expect(page.locator('.absolute > .p-3')).toBeVisible();

});
