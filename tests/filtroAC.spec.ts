import { test, expect, Page } from "@playwright/test";
/////////
//Nombre: Romane Susana Quiroga Ledezma
//Descripción:
// La automatización busca validar que al aplicar el filtro de nombres en el rango **A–C**, los resultados mostrados correspondan únicamente a Fixers cuyos nombres comienzan con esas letras.
/////////
test("Seleccionar y validar filtro A–C", async ({ page }) => {
  // Paso 1: Abrir la página principal
  await page.goto("https://devmasters-servineo-frontend-zk3q.vercel.app/es");
  await esperar(5);

  // Paso 2: Clic en botón "Buscar"
  await page.locator('button[type="submit"]').click();
  await esperar(5);

  // Paso 3: Abrir filtros
  await page
    .locator(
      "body > div:nth-child(14) > div:nth-child(1) > button:nth-child(1)"
    )
    .click();
  await esperar(5);

  // Paso 4: Seleccionar sección "Fixer"
  await page.locator("//body/main/div/div/div[2]/div[1]/div[1]").click();
  await esperar(5);

  // Paso 5: Activar checkboxes A–C
  await page.locator("//label[1]//div[1]//input[1]").click();
  await esperar(5);

  // Paso 6: Validar nombres en los resultados
  await validarNombres(page);
});

// Función de espera manual para ver ejecución más clara
function esperar(segundos: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, segundos * 1000));
}

// Función para validar que los nombres comiencen con A–C
async function validarNombres(page: Page): Promise<void> {
  const nombres = await page
    .locator("p.text-sm.font-medium.text-gray-900.truncate")
    .allTextContents();

  let todosValidos = true;

  for (const texto of nombres) {
    const nombre = texto.trim();
    if (nombre.length > 0) {
      const inicial = nombre.charAt(0).toUpperCase();
      if (inicial >= "A" && inicial <= "C") {
        console.log(`Nombre válido: ${nombre}`);
      } else {
        console.log(`Nombre fuera del rango A–C: ${nombre}`);
        todosValidos = false;
      }
    }
  }

  // EXPECT: la prueba debe fallar si algún nombre no cumple el rango
  expect(
    todosValidos,
    "Se encontraron nombres fuera del rango permitido (A–C)."
  ).toBe(true);
}
