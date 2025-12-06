import { test, expect, Page } from '@playwright/test';

test('Filtro Combinado Buscar y Calificar', async ({ page }) => {

    // Paso 1: Abrir página principal
    await page.goto('https://servineo.app/es');
    await esperar(3);

    // Paso 2: Cerrar ventana emergente si aparece
    try {
        await page.locator('//button[normalize-space()="No, gracias"]').click({ timeout: 5000 });
        await esperar(2);
    } catch (e) {
        // No apareció ventana emergente
    }

    // Paso 3: Ingresar a Ofertas de Trabajo
    await page.locator('//a[@href="/job-offer-list" and contains(text(), "Ofertas de trabajo")]').click();
    await esperar(3);

    // Paso 4: Escribir el servicio "Jardinero"
    await page.locator('//input[@placeholder="¿Qué servicio necesitas?"]').fill('Jardinero');
    await esperar(1);

    // Paso 5: Ejecutar búsqueda
    await page.locator('//button[contains(@class, "bg-[#2B6AE0]") and normalize-space()="Buscar"]').click();
    await esperar(3);

    // Paso 6: Abrir panel de filtros
    await page.locator('//button[contains(@class, "bg-[#2B6AE0]")]//*[name()="svg" and contains(@class, "lucide-sliders-horizontal")]//parent::button').click();
    await esperar(3);

    // Paso 7: Abrir sección "Calificación"
    await page.locator('//div[span[text()="Calificación"]]').click();
    await esperar(3);

    // Paso 8: Seleccionar filtro de 3 estrellas
    await page.locator('//button[@aria-label="3 estrellas"]').click();
    await esperar(2);

    // Paso 9: Cerrar panel de filtros
    await page.locator('//body').click();
    await esperar(3);

    // Paso 10: Validar que las calificaciones estén en el rango 3.0–3.9
    await validarCalificaciones(page, 3.0, 3.9);

});


// Espera manual para ver ejecución más clara
function esperar(segundos: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, segundos * 1000));
}


// Valida que todas las calificaciones visibles estén dentro del rango esperado
async function validarCalificaciones(page: Page, min: number, max: number): Promise<void> {

    // Obtener todas las calificaciones visibles
    const calificaciones = await page.locator('span.text-xs.font-semibold.text-gray-600').allTextContents();

    let todasCorrectas = true;

    // Verificar cada calificación
    for (const valor of calificaciones) {
        const cal = parseFloat(valor.trim());

        if (!isNaN(cal)) {
            if (cal < min || cal > max) {
                // Si una calificación no está en el rango, marcamos como incorrecto
                todasCorrectas = false;
            }
        } else {
            todasCorrectas = false;
        }
    }

    // EXPECT: la prueba debe fallar si al menos una calificación no cumple el rango
    expect(
        todasCorrectas,
        `Se encontraron calificaciones fuera del rango permitido (${min} a ${max}).`
    ).toBe(true);
}
