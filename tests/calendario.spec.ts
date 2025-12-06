import { test, expect } from '@playwright/test';

test('Test Robusto de Calendario', async ({ page }) => {
  console.log("🚀 INICIANDO TEST ROBUSTO DE CALENDARIO (PLAYWRIGHT)");

  await page.goto('https://servineo.app/es/adv-search');
  await page.waitForTimeout(3000);

  await page.locator('input[value="specific"]').locator('..').click();
  console.log("1. Opción 'Fecha específica' seleccionada.");

  // PASO 2: ABRIR EL CALENDARIO
  await page.waitForTimeout(3000);
  await page.locator("//input[@placeholder='AAAA']/following::button[1]").click();
  console.log("2. Calendario abierto.");
  await page.waitForTimeout(3000);

  await page.getByLabel('Mes siguiente').click();
  console.log("3. Cambiado al mes siguiente.");

  // PASO 4: SELECCIONAR DÍA 15
  await page.locator("//div[not(contains(@class, 'text-gray-400')) and normalize-space(text())='15']").click();
  console.log("4. Día 15 seleccionado.");

  const btnAceptar = page.getByRole('button', { name: 'Aceptar' });

  // Verificamos si es visible con un timeout corto (3s como en tu Java)
  // Si es visible lo clickeamos, si no, asumimos que se cerró solo.
  try {
    await btnAceptar.waitFor({ state: 'visible', timeout: 3000 });
    await btnAceptar.click();
    console.log("5. ✅ Botón 'Aceptar' presionado.");
  } catch (e) {
    console.log("ℹ️ INFO: No se encontró botón 'Aceptar' o el calendario se cerró automáticamente. Continuando...");
  }

  const inputDD = page.getByPlaceholder('DD');
  
  await expect(inputDD).toHaveValue('15');
  console.log("✅ TEST EXITOSO: El input DD muestra '15'.");
});