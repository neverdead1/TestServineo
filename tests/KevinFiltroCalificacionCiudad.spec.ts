import { test, expect, Page } from '@playwright/test';

//SERVINO - ID576 - Filtro Combinado Ciudad y Calificación

test('Filtro Combinado Ciudad y Calificar', async ({ page }) => {

    // Paso 1: Abrir página principal
    await page.goto('https://servineo.app/es');
    await esperar(1);

    // Paso 2: Cerrar ventana emergente si aparece
    try {
        await page.locator('//button[normalize-space()="No, gracias"]').click({ timeout: 1000 });
        await esperar(1);
    } catch (e) {}

    // Paso 3: Ingresar a Ofertas de Trabajo
    await page.locator('//a[@href="/job-offer-list" and contains(text(), "Ofertas de trabajo")]').click();
    await esperar(1);
    
    // Paso 4: Abrir panel de filtros
    await page.locator('//button[contains(@class, "bg-[#2B6AE0]")]//*[name()="svg" and contains(@class, "lucide-sliders-horizontal")]//parent::button').click();
    await esperar(1);

    // Paso 5: Ingresar al filtro de Ciudad
    await page.locator("//span[normalize-space()='Ciudad']/parent::div").click();
    await esperar(2);

    // Paso 6: Seleccionar Ciudad "Cochabamba"
    await page.locator("//div[span[normalize-space()='Cochabamba']]/input[@type='checkbox']").check();
    await esperar(2);

    // Paso 7: Abrir sección "Calificación"
    await page.locator('//div[span[text()="Calificación"]]').click();
    await esperar(2);

    // Paso 8: Seleccionar filtro de 5 estrellas
    await page.locator('//button[@aria-label="5 estrellas"]').click();
    await esperar(2);

    // Guardar resultados de la primera filtración 
    const resultadosPrimeraFiltracion = await obtenerResultados(page);

    // paso 9: Deseleccionar la calificacione 5 estrellas
    await page.locator('//button[@aria-label="5 estrellas"]').click();
    await esperar(2);

    // Paso 10: Deseleccionar la Ciudad "Cochabamba"
    await page.locator("//div[span[normalize-space()='Cochabamba']]/input[@type='checkbox']").uncheck();
    await esperar(2);

    // Paso 11: Seleccionar filtro de 5 estrellas
    await page.locator('//button[@aria-label="5 estrellas"]').click();
    await esperar(2);

    // Paso 12: Seleccionar Ciudad "Cochabamba"
    await page.locator("//div[span[normalize-space()='Cochabamba']]/input[@type='checkbox']").check();
    await esperar(2);

    // Guardar resultados de la segunda filtración
    const resultadosSegundaFiltracion = await obtenerResultados(page);

    //Comparar los resultados
    console.log('Resultados Ciudad → Calificación:', resultadosPrimeraFiltracion);
    console.log('Resultados Calificación → Ciudad:', resultadosSegundaFiltracion);

    expect(resultadosPrimeraFiltracion).toEqual(resultadosSegundaFiltracion);
    console.log('Los resultados coinciden en ambos órdenes de filtrado');

});

// Función para obtener resultados visibles de ciudad y calificación
async function obtenerResultados(page: Page) {
    // Ajusta los selectores según tu página
    const ciudades = await page.locator('div.absolute span.text-gray-700').allTextContents();
    const calificaciones = await page.locator('span.text-xs.font-semibold.text-gray-600').allTextContents();

    // Combina ciudad y calificación en un objeto
    return ciudades.map((c, i) => ({
        ciudad: c.trim(),
        calificacion: calificaciones[i]?.trim() || ''
    }));
}

// Espera manual
function esperar(segundos: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, segundos * 1000));
}
