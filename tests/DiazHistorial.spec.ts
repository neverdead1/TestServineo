import { test, expect } from '@playwright/test';


// VERIFICAR que despues de seleccionar un item del historial, se oculte el historial de la interfaz


test('Test automatizado', async ({ page }) => {

  // 1. open on https://servineo.app/es
  await page.goto('https://servineo.app/es');

  // 2. setWindowSize 1044x806
  await page.setViewportSize({ width: 1044, height: 806 });

  // 🔹 Esperar 4 segundos para que cargue el popup del tour
  await page.waitForTimeout(4000);

  // 🔹 Cerrar popup del tour si aparece
  const closeTourBtn = page.locator('button.reactour__close-button');
  if (await closeTourBtn.isVisible()) {
    await closeTourBtn.click();
  }

  // 3. click en link "Ofertas de trabajo"
  await page.getByRole('navigation', { name: 'Menú principal' })
  .getByRole('link', { name: 'Ofertas de trabajo' })
  .click();

  // 4. esperar .border-input
  await page.waitForSelector('.border-input');

  // 5. ingresar "techador"
  await page.fill('.border-input', 'techador');

  // 6. click en el nuevo botón .sm:px-6:nth-child(1)
  await page.click('.sm\\:px-6:nth-child(1)');

  // 7. click en X (lucide-x)
  await page.click('.lucide-x');

  // 8. click en .border-input otra vez
  await page.click('.border-input');

  // 9. click en .text-slate-700
  await page.click('.text-slate-700');

  // 10. assertElementNotPresent (.mt-2:nth-child(4))
  const element = page.locator('.mt-2:nth-child(4)');
  await expect(element).toHaveCount(0);
});
