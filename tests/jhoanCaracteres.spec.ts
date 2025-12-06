import { test, expect, Page } from '@playwright/test';
//Test SERVINOD-51    Verificar que al ingresar caracteres especiales entre palabras no se alteren las busquedas
test("Test caracteres input (TypeScript)", async ({ page }) => {
  const terminoEsperado: string = "Albañil";

  // 1. Ingresamos al sitio
  await page.goto("https://servineo.app/es");
  await page.waitForTimeout(2000);

  // Cerramos el popup de bienvenida si existe
  const closeButton = page.locator("button.reactour__close-button");
  if (await closeButton.isVisible()) {
    await closeButton.click();
  }
  await page.waitForTimeout(2000);
  // Nos dirigimos a ofertas
  await page.locator("a[href*='job-offer-list']").first().click();
  await page.waitForTimeout(1000);

  // Selector reutilizable para el botón de búsqueda
  // Nota: Ajusta este selector si el botón tiene un ID o clase específica mejor
  const searchButton = page.locator("body > div:nth-child(8) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)");
  
  // Selector reutilizable para el botón de limpiar
  const clearButton = page.locator("//button[@aria-label='Limpiar búsqueda']//*[name()='svg']");

  // --- PRUEBA 1: Intercalado ---
  await page.getByPlaceholder('¿Qué servicio necesitas?').fill("Alba------ñil");
  await searchButton.click();
  await page.waitForTimeout(2000);

  // ASERCIÓN 1
  // Buscamos el H3 que contiene el título de la card
  const titleLocator1 = page.locator("h3.text-base.font-semibold").first();
  await expect(titleLocator1).toContainText(terminoEsperado);
  
  // Limpiar
  await clearButton.click();

  // --- PRUEBA 2: Prefijo ---
  await page.getByPlaceholder('¿Qué servicio necesitas?').fill("------Albañil");
  await searchButton.click();
  await page.waitForTimeout(2000);

  // ASERCIÓN 2
  const titleLocator2 = page.locator("h3.text-base.font-semibold").first();
  await expect(titleLocator2).toContainText(terminoEsperado);

  // Limpiar
  await clearButton.click();

  // --- PRUEBA 3: Sufijo ---
  await page.getByPlaceholder('¿Qué servicio necesitas?').fill("Albañil------");
  await searchButton.click();
  await page.waitForTimeout(2000);

  // --- CAPTURA Y COMPARACIÓN MANUAL (Lo que pediste) ---
  
  // 1. Localizamos el elemento
  const cardTitleLocator = page.locator("h3.text-base.font-semibold").first();
  
  // 2. Extraemos el texto (Tipado como string | null)
  const textoDeLaCard: string | null = await cardTitleLocator.textContent();
  
  // 3. Log para depuración
  console.log(`Texto extraído: "${textoDeLaCard}"`);
  console.log(`Parametro buscado:"${terminoEsperado}"`);

  // 4. Validación estricta con TypeScript
  // Verificamos que no sea null y contenga el texto
  expect(textoDeLaCard).not.toBeNull();
  expect(textoDeLaCard?.trim()).toContain(terminoEsperado);
});