import { test, expect, Page } from '@playwright/test';
//Test case Jhoan SERVINO: Verificar que persistan las opciones seleccionadas de una seccion despues de aplicar la busqueda avanzada
test("Test Integracion", async ({ page }) => {
const ciudadSeleccionada: string = "Cochabamba";
await page.waitForTimeout(1000);
  await page.goto("https://servineo.app/es");
  await page.waitForTimeout(2000);

  const closeButton = page.locator("button.reactour__close-button");
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }

  await page.locator("a[href*='job-offer-list']").first().click();
  await page.waitForTimeout(3000);

  const card = page.locator("//div[@class='flex-shrink-0']");
  await card.waitFor();
  await card.click();
  await page.waitForTimeout(3000);

  await page.locator("//div[6]//div[1]").click(); //abre ciudades

  await page.locator('label', { hasText: 'Cochabamba' }).locator('input').check(); //seleccionamos

  await page.locator("//button[@class='bg-[#2B6AE0] hover:bg-[#265ACC] text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors duration-300 shadow-md']").click();
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Modificar' }).click();
  await page.waitForTimeout(2000);

  // Verificación importante:
  const cochabambaCheck = page.locator('label', { hasText: 'Cochabamba' }).locator('input');
  await expect(cochabambaCheck).toBeChecked();
  console.log(`La ciudad: ${ciudadSeleccionada} se mantiene seleccionada`);

});