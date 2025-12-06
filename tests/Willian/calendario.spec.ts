import { test, expect, Page, Locator } from '@playwright/test';

test.use({
    headless: false,
    launchOptions: {
        slowMo: 1000, // Un poco más rápido para que no sea eterno
    },
});

test('Test Visual: Calendario con Scroll Automático', async ({ page }) => {
    console.log('👁️ INICIANDO PRUEBA VISUAL...');

    // 1. Ir a la página
    await page.goto('https://servineo.app/es/adv-search');
    
    // 2. Opción Específica
    const radioBtn = page.locator('//input[@value="specific"]/..');
    await hacerVisible(radioBtn); // ✨ Scroll + Resaltado
    await radioBtn.click();

    // 3. Abrir Calendario
    const btnCalendar = page.locator('//input[@placeholder="AAAA"]/following::button[1]');
    await hacerVisible(btnCalendar);
    await btnCalendar.click();

    // 4. Siguiente mes
    const btnNext = page.locator('//button[@aria-label="Mes siguiente"]');
    await hacerVisible(btnNext);
    await btnNext.click();

    // 5. Seleccionar día 15
    const dia15 = page.locator('//div[not(contains(@class, "text-gray-400")) and normalize-space(text())="15"]');
    await hacerVisible(dia15);
    await dia15.click();

    // 6. Botón Aceptar
    try {
        const btnAceptar = page.locator('//button[normalize-space()="Aceptar"]');
        if (await btnAceptar.isVisible({ timeout: 2000 })) {
            await hacerVisible(btnAceptar);
            await btnAceptar.click();
        }
    } catch (e) {}

    // 🚨 AQUÍ EL SCROLL HASTA EL FONDO (Si lo necesitas para ver el footer o algo más abajo)
    console.log('⬇️ Bajando hasta el fondo de la página...');
    await scrollHastaElFondo(page); 

    // 7. Validación
    const inputDD = page.locator('//input[@placeholder="DD"]');
    await hacerVisible(inputDD);
    await expect(inputDD).toHaveValue('15');

    console.log('✅ PRUEBA FINALIZADA');
});

/**
 * ✨ FUNCIÓN MEJORADA: 
 * 1. Hace scroll suave hasta que el elemento quede en el CENTRO.
 * 2. Lo resalta con borde rojo y fondo amarillo.
 */
async function hacerVisible(locator: Locator) {
    // Primero esperamos que exista
    await locator.waitFor({ state: 'visible' });

    // Scroll suave para ponerlo en el centro de la pantalla
    await locator.evaluate((element) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    });

    // Pequeña pausa para que el ojo humano vea que llegó ahí
    await locator.page().waitForTimeout(500);

    // Efecto visual (Borde Rojo)
    await locator.evaluate((node) => {
        node.style.border = '4px solid red';
        node.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
        node.style.transition = 'all 0.3s';
        node.style.transform = 'scale(1.1)';
    });
}

/**
 * ⬇️ FUNCIÓN EXTRA: Baja suavemente hasta el final de la página
 */
async function scrollHastaElFondo(page: Page) {
    await page.evaluate(async () => {
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        // Baja de 100 en 100 pixeles
        for (let i = 0; i < document.body.scrollHeight; i += 100) {
            window.scrollTo(0, i);
            await delay(20); // Velocidad del scroll
        }
    });
}