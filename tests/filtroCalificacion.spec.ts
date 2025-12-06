import { test, expect, Page } from '@playwright/test';

test('Filtro Combinado Buscar y Calificar', async ({ page }) => {
    console.log('Paso 1: Abriendo página...');
    await page.goto('https://servineo.app/es');
    await esperar(3);

    console.log('Paso 2: Cerrando ventana emergente...');
    try {
        await page.locator('//button[normalize-space()="No, gracias"]').click({ timeout: 5000 });
        console.log('✓ Ventana cerrada');
        await esperar(2);
    } catch (e) {
        console.log('✓ No hay ventana emergente');
    }

    console.log('Paso 3: Haciendo clic en Ofertas de trabajo...');
    await page.locator('//a[@href="/job-offer-list" and contains(text(), "Ofertas de trabajo")]').click();
    console.log('✓ Clic realizado');
    await esperar(3);

    console.log('Paso 4: Escribiendo Jardinero...');
    await page.locator('//input[@placeholder="¿Qué servicio necesitas?"]').fill('Jardinero');
    console.log('✓ Texto ingresado');
    await esperar(1);

    console.log('Paso 5: Haciendo clic en Buscar...');
    await page.locator('//button[contains(@class, "bg-[#2B6AE0]") and normalize-space()="Buscar"]').click();
    console.log('✓ Búsqueda ejecutada');
    await esperar(3);

    console.log('Paso 6: Abriendo filtros...');
    await page.locator('//button[contains(@class, "bg-[#2B6AE0]")]//*[name()="svg" and contains(@class, "lucide-sliders-horizontal")]//parent::button').click();
    console.log('✓ Filtros abiertos');
    await esperar(3);

    console.log('Paso 7: Expandiendo Calificación...');
    await page.locator('//div[span[text()="Calificación"]]').click();
    console.log('✓ Calificación expandida');
    await esperar(3);

    console.log('Paso 8: Seleccionando 3 estrellas...');
    await page.locator('//button[@aria-label="3 estrellas"]').click();
    console.log('✓ 3 estrellas seleccionadas');
    await esperar(2);

    console.log('Paso 9: Cerrando panel...');
    await page.locator('//body').click();
    await esperar(3);

    console.log('Paso 10: Validando calificaciones...');
    await validarCalificaciones(page, 3.0, 3.9);

    console.log('\n✓✓✓ PRUEBA COMPLETADA ✓✓✓\n');
});

function esperar(segundos: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, segundos * 1000));
}

async function validarCalificaciones(page: Page, min: number, max: number): Promise<void> {
    const calificaciones = await page.locator('span.text-xs.font-semibold.text-gray-600').allTextContents();

    let todasCorrectas = true;

    for (const valor of calificaciones) {
        try {
            const cal = parseFloat(valor.trim());
            if (!isNaN(cal)) {
                if (cal >= min && cal <= max) {
                    console.log(`Calificación correcta: ${cal}`);
                } else {
                    console.log(`Calificación fuera del rango: ${cal}`);
                    todasCorrectas = false;
                }
            }
        } catch (e) {
            console.log(`No se pudo leer la calificación: ${valor}`);
            todasCorrectas = false;
        }
    }

    if (todasCorrectas) {
        console.log(`\nTodas las calificaciones cumplen con el rango ${min}-${max}`);
    } else {
        console.log(`\nSe encontraron calificaciones fuera del rango ${min}-${max}`);
    }
}