import { test, expect } from '@playwright/test';
//TITULO TC: Verificar que al aplicar un filtro en Ofertas la paginación se reinicia a pag 1

//DESCRIPCION:Cuando el usuario esta en una pagina especifica y aplica un nuevo filtro en la sección
//de Ofertas de trabajo, se debe reiniciar la paginación y el número de página cambia a 1.

test('Paginación y filtro de ciudad', async ({ page }) => {
  // 1. INGRESAR AL LINK
  await page.goto('https://servineo.app/es');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); 

  // 2. CERRAR MODAL DE "Recorrido del sistema"
  try {
    await page.getByText("No, gracias", { exact: true }).click({ timeout: 1000 });
    console.log("Modal cerrado");
  } catch {
    console.log("No apareció el modal");
  }
  await page.waitForTimeout(1000); 

  // 3. Ir a la sección "Ofertas de trabajo"
  await page.locator('[aria-label="Menú principal"]').getByText("Ofertas de trabajo").click();
  await page.waitForURL("**/job-offer-list**");
  await page.waitForTimeout(2000); 

  // 4. Ir a la pagina 6
  const boton_pagina6 = page.getByRole("button", { name: "Página 6" });
  await boton_pagina6.waitFor({ state: 'visible', timeout: 15000 });
  await boton_pagina6.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000); 
  await boton_pagina6.click();
  await page.waitForURL("**page=6**");
  console.log("Cambio a pagina 6 correctamente");
  await page.waitForTimeout(2000);
  await boton_pagina6.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);

  // 5. Abrir filtros
  const boton_filtro = page.locator("button svg.lucide-sliders-horizontal");
  await boton_filtro.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await boton_filtro.click();
  await page.waitForTimeout(1000); 
  // 6. Abrir filtro de ciudad
  await page.getByText("Ciudad", { exact: true }).click();
  await page.waitForTimeout(500);

  // 7. Seleccionar checkbox "Cochabamba"
  const cochabamba_checkbox = page.locator('label:has-text("Cochabamba") input[type="checkbox"]');
  await cochabamba_checkbox.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await cochabamba_checkbox.check();
  console.log("Checkbox Cochabamba seleccionado");
  await page.waitForTimeout(1000); 

  // 8. Verificar que volvió a página 1
  const boton_pagina1 = page.getByRole("button", { name: "Página 1" });
  await boton_pagina1.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000); 

  // Validación con expect 
  await expect(page).toHaveURL(/.*page=1.*/);
  console.log("Volvio a pagina 1 correctamente");
  await page.waitForTimeout(2000); 
});
