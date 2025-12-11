import { test, expect, Page } from '@playwright/test';
//Test case Jhoan SERVINO: Verificar la persistencia de las opciones seleccionadas de una seccion despues de aplicar la busqueda avanzada
test("Test Integracion", async ({ page }) => {
  const ciudadSeleccionada: string = "Cochabamba";
  await page.waitForTimeout(1000);
  //Ingresamos al sitio de servineo
  await page.goto("https://servineo.app/es");
  await page.waitForTimeout(2000);
  //si existe una ventana de bienvida la cerramos
  const closeButton = page.locator("button.reactour__close-button");
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
  //Seleccionamos la opcion de ofertas de trabajo
  await page.locator("a[href*='job-offer-list']").first().click();
  await page.waitForTimeout(3000);

  //Seleccionamos la opcion de busqueda avanzada
  const card = page.locator("//div[@class='flex-shrink-0']");
  await card.waitFor();
  await card.click();
  await page.waitForTimeout(3000);

  //Hacemos clic en la seccion de ciudades
  await page.locator("//div[6]//div[1]").click(); //abre ciudades

  //Seleccionamos en la seccion Ciudad la opcion Cochabamba
  await page.waitForTimeout(2000);
  await page.locator('label', { hasText: 'Cochabamba' }).locator('input').check(); //seleccionamos

  //Se aplica la busqueda
  await page.locator("//button[@class='bg-[#2B6AE0] hover:bg-[#265ACC] text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors duration-300 shadow-md']").click();
  await page.waitForTimeout(2000);

  //Se selecciona la opcion de modificar
  await page.getByRole('button', { name: 'Modificar' }).click();
  await page.waitForTimeout(2000);

  // Verificación importante:
  const cochabambaCheck = page.locator('label', { hasText: 'Cochabamba' }).locator('input');
  await expect(cochabambaCheck).toBeChecked();
  await page.waitForTimeout(2000);
  console.log(`La ciudad: ${ciudadSeleccionada} se mantiene seleccionada`);

});