import { test, expect, Page } from '@playwright/test';
// Romane
test('Seleccionar y validar filtro A-C', async ({ page }) => {
  // Maximizar ventana
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Abrir la página
  await page.goto('https://devmasters-servineo-frontend-zk3q.vercel.app/es');

  // Clic en botón "Buscar"
  const buscarBtn = page.locator("button[type='submit']");
  await buscarBtn.waitFor({ state: 'visible' });
  await buscarBtn.click();

  // Abrir filtros
  const filtrosBtn = page.locator("body > div:nth-child(14) > div:nth-child(1) > button:nth-child(1)");
  await filtrosBtn.waitFor({ state: 'visible' });
  await filtrosBtn.click();

  // Seleccionar sección "Fixer"
  const fixerSection = page.locator("//body/main/div/div/div[2]/div[1]/div[1]");
  await fixerSection.waitFor({ state: 'visible' });
  await fixerSection.click();

  // Activar checkboxes A–C
  const checkboxA = page.locator("//label[1]//div[1]//input[1]");
  const checkboxB = page.locator("//label[2]//div[1]//input[1]");
  const checkboxC = page.locator("//label[3]//div[1]//input[1]");

  await checkboxA.check();
  await checkboxB.check();
  await checkboxC.check();

  // Validar nombres en los resultados
  const nombres = page.locator("p.text-sm.font-medium.text-gray-900.truncate");
  const count = await nombres.count();

  let todosValidos = true;

  for (let i = 0; i < count; i++) {
    const texto = (await nombres.nth(i).innerText()).trim();
    if (texto) {
      const inicial = texto.charAt(0).toUpperCase();
      if (inicial >= 'A' && inicial <= 'C') {
        console.log(`Nombre válido: ${texto}`);
      } else {
        console.log(`Nombre fuera del rango A–C: ${texto}`);
        todosValidos = false;
      }
    }
  }

  if (todosValidos) {
    console.log('Todos los nombres cumplen con el rango A–C.');
  } else {
    console.log('Se encontraron nombres fuera del rango A–C.');
  }
});

//Antoni
test('Filtro combinado: Buscar y calificar', async ({ page }) => {
  
  await page.setViewportSize({ width: 1920, height: 1080 });

  
  await page.goto('https://devmasters-servineo-frontend-zk3q.vercel.app/es');

  
  const buttonOfertaTrabajo = page.locator("button[type='submit']");
  await buttonOfertaTrabajo.waitFor({ state: 'visible' });
  await buttonOfertaTrabajo.click();

 
  const inputBusqueda = page.getByPlaceholder('¿Qué servicio necesitas?');
  await inputBusqueda.waitFor({ state: 'visible' });
  await inputBusqueda.fill('Jardinero');

  
  const buttonBuscar = page.locator("//button[normalize-space()='Buscar']");
  await buttonBuscar.waitFor({ state: 'visible' });
  await buttonBuscar.click();

  
  const buttonFiltros = page.locator("body > div:nth-child(14) > div:nth-child(1) > button:nth-child(1)");
  await buttonFiltros.waitFor({ state: 'visible' });
  await buttonFiltros.click();

 
  const seccionCalificacion = page.locator("//div[span[text()='Calificación']]");
  await seccionCalificacion.waitFor({ state: 'visible' });
  await seccionCalificacion.click();

 
  const boton3Estrellas = page.locator("//button[@aria-label='3 estrellas']");
  await boton3Estrellas.waitFor({ state: 'visible' });
  await boton3Estrellas.click();

 
  await page.locator('body').click();

  
  await validarCalificaciones(page, 3.0, 3.9);
});

async function validarCalificaciones(page: Page, min: number, max: number) {
  const calificaciones = page.locator("span.text-xs.font-semibold.text-gray-600");
  const count = await calificaciones.count();

  let todasCorrectas = true;

  for (let i = 0; i < count; i++) {
    const valor = (await calificaciones.nth(i).innerText()).trim();
    const cal = parseFloat(valor);
    if (!isNaN(cal)) {
      if (cal >= min && cal <= max) {
        console.log(`Calificación correcta: ${cal}`);
      } else {
        console.log(`Calificación fuera del rango: ${cal}`);
        todasCorrectas = false;
      }
    } else {
      console.log(`No se pudo leer la calificación: ${valor}`);
      todasCorrectas = false;
    }
  }

  if (todasCorrectas) {
    console.log(`Todas las calificaciones cumplen con el rango ${min}-${max}.`);
  } else {
    console.log(`Se encontraron calificaciones fuera del rango ${min}-${max}.`);
  }

  expect(todasCorrectas).toBeTruthy();
}