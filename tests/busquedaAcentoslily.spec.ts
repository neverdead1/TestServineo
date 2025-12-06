import { test, expect } from '@playwright/test';
//TITULO TC: Verificar que la búsqueda funcione con palabras acentuadas

//DESCRIPCION: Si el usuario ingresa palabras con acentos a la barra de búsqueda, 
// la búsqueda se realiza con normalidad trayendo los resultados a pesar de si 
// tiene o no acentos la palabra en el sistema. Demostrando que no es sensible a acentos.

// Función para quitar acentos para conteo de resultados
function quitarAcentos(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

test('Validar búsqueda con acentos', async ({ page }) => {
  // 1. INGRESAR AL LINK
  await page.goto('https://servineo.app/es');

  await page.waitForTimeout(2000);

  // 2.CERRAR MODAL DE "Recorrido del sistema"
  try {
    await page.locator('text=No, gracias').click({ timeout: 2000 });
    console.log('Modal cerrado');
  } catch {
    console.log('No apareció el modal');
  }
  // 3. Ubicar la barra de búsqueda en el home
  const campoBusqueda = page.locator('//input[@placeholder="¿Que servicio necesitas?"]');

  const palabra = "cérrajéró";

  // 4. Ingresar un texto con acentos en el campo de busqueda
  for (const letra of palabra) {
    await campoBusqueda.type(letra, { delay: 300 });
  }

  // 5. Clic en buscar
  await page.locator('//button[text()="Buscar"]').click();
  await page.waitForTimeout(3000);

  // 5. Validar redirección - Visualizar la pestaña de ofertas de trabajo
  await expect(page).toHaveURL(/.*job-offer-list.*/);

  console.log("Redirige correctamente a página de ofertas de trabajo");

  // 6. Validar resultados
  //Resultado esperado: Se realiza la búsqueda trayendo los resultados con normalidad
  const resultados = page.locator('//div[@class="cursor-pointer"]');
  const count = await resultados.count();

  expect(count).toBeGreaterThan(0);

  console.log(`Se encontraron ${count} resultados para '${palabra}'`);
  await page.waitForTimeout(8000);
});
