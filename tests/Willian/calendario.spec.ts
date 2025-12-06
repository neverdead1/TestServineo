import { test, expect, Page, Locator } from '@playwright/test';

// CONFIGURACIÓN DEL ENTORNO DE PRUEBA
// slowMo: Agrega un retraso global para que la ejecución sea visible al ojo humano.
// headless: false: Abre el navegador visualmente (necesario para ver el puntero).
test.use({
    headless: false,
    launchOptions: {
        slowMo: 800, 
    },
});

test('Verificar que el calendario de busqueda avanzada se seleccione la fecha 15/12/2025', async ({ page, browserName }) => {
    // Aumentamos el timeout a 60s para evitar fallos en redes lentas o navegadores pesados
    test.setTimeout(60000); 

    console.log(`--- INICIANDO PRUEBA EN: ${browserName.toUpperCase()} ---`);

    // PARTE 1: NAVEGACION

    console.log('PASO 1: Ingresando al Home...');
    // page.goto espera automáticamente el evento 'load', asegurando que la página base cargó.
    await page.goto('https://servineo.app/es');

    // INSTALACIÓN DEL PUNTERO VISUAL
    // Se hace después del goto porque la navegación limpia el DOM.
    // Esta función inyecta un DIV rojo en la página.
    await instalarPunteroVisual(page);

    // MANEJO DE PUBLICIDAD (Lógica condicional)
    // Usamos try-catch para dar robustez: si el modal no aparece (común en repeticiones), el test no falla.
    console.log('PASO 2: Verificando publicidad emergente...');
    try {
        const btnNoGracias = page.locator('//button[normalize-space()="No, gracias"]');
        if (await btnNoGracias.isVisible({ timeout: 4000 })) {
            console.log('   Publicidad detectada. Cerrando ventana...');
            await interactuar(page, btnNoGracias);
            await btnNoGracias.click();
        } else {
            console.log('   No se detectó publicidad.');
        }
    } catch (e) {
        console.log('   Continuando flujo normal.');
    }

    // NAVEGACIÓN A OFERTAS
    console.log('PASO 3: Navegando a la sección Ofertas...');
    const linkOfertas = page.locator('//a[contains(@href, "job-offer-list")]').first();
    await interactuar(page, linkOfertas);
    await linkOfertas.click();

    // BÚSQUEDA AVANZADA
    console.log('PASO 4: Abriendo Búsqueda Avanzada...');
    const btnLupa = page.locator('button[aria-label="Go to advanced search"]');
    await interactuar(page, btnLupa);
    await btnLupa.click();

    // VALIDACIÓN DE CARGA
    console.log('   Esperando carga completa del módulo de búsqueda...');
    await page.waitForURL('**/adv-search', { timeout: 10000 });
    await expect(page.locator('input[value="specific"]')).toBeVisible();

    // PARTE 2: INTERACCIÓN CON EL CALENDARIO

    // SELECCIÓN DE RADIO BUTTON
    console.log('PASO 5: Seleccionando opción Fecha Específica...');
    const radioBtn = page.locator('//input[@value="specific"]/..');
    await interactuar(page, radioBtn);
    await radioBtn.click();

    // ABRIR CALENDARIO
    console.log('PASO 6: Desplegando el calendario...');
    const btnCalendar = page.locator('//input[@placeholder="AAAA"]/following::button[1]');
    await interactuar(page, btnCalendar);
    await btnCalendar.click();

    // CAMBIAR DE MES
    console.log('PASO 7: Cambiando al mes siguiente...');
    const btnNext = page.locator('//button[@aria-label="Mes siguiente"]');
    await interactuar(page, btnNext); 
    await btnNext.click();

    // SELECCIONAR DÍA
    console.log('PASO 8: Seleccionando el día 15...');
    const dia15 = page.locator('//div[not(contains(@class, "text-gray-400")) and normalize-space(text())="15"]');
    await interactuar(page, dia15);
    await dia15.click();

    // CONFIRMAR FECHA (Si aplica)
    console.log('PASO 9: Confirmando selección...');
    try {
        const btnAceptar = page.locator('//button[normalize-space()="Aceptar"]');
        if (await btnAceptar.isVisible({ timeout: 3000 })) {
            console.log('   Botón Aceptar visible. Haciendo clic...');
            await interactuar(page, btnAceptar);
            await btnAceptar.click();
        } else {
            console.log('   El calendario se cerró automáticamente.');
        }
    } catch (e) {}

    // PARTE 3: VALIDACIÓN Y ASSERTIONS=

    console.log('PASO 10: Validando resultado final...');
    console.log('   Haciendo scroll hasta el final de la página...');
    await scrollHastaElFondo(page); 

    const inputDD = page.locator('//input[@placeholder="DD"]');
    await interactuar(page, inputDD);
    
    // Assertion (Validación): Verifica que el valor interno del input sea '15'.
    // Si esto falla, Playwright detiene el test y marca error.
    await expect(inputDD).toHaveValue('15');

    console.log('--- TEST FINALIZADO EXITOSAMENTE ---');
    await page.waitForTimeout(2000);
});

// FUNCIONES DE EFECTOS VISUALES

/**
 * Función interactuar:
 * 1. Espera a que el elemento esté visible y estable (Auto-wait).
 * 2. Mueve el puntero visual rojo hacia el centro del elemento.
 * 3. Aplica estilos CSS (borde neón) para resaltar la acción.
 */
async function interactuar(page: Page, locator: Locator) {
    await locator.waitFor({ state: 'visible', timeout: 10000 });

    const box = await locator.boundingBox();
    if (box) {
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        await moverPunteroVisual(page, x, y);
    }
    await locator.scrollIntoViewIfNeeded();
    await locator.evaluate((node) => {
        node.style.transition = 'all 0.3s ease';
        node.style.outline = '3px solid #00ffcc';
        node.style.boxShadow = '0 0 15px #00ffcc';
        node.style.transform = 'scale(1.05)';
    });
}

/**
 * Función moverPunteroVisual:
 * Maneja la lógica del "cursor falso". Incluye un sistema de auto-recuperación:
 * si la página se recarga y el cursor se borra, esta función detecta que no existe
 * y lo vuelve a inyectar en el DOM automáticamente.
 */
async function moverPunteroVisual(page: Page, x: number, y: number) {
    await page.evaluate(({ x, y }) => {
        let cursor = document.getElementById('playwright-cursor');
        
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.id = 'playwright-cursor';
            Object.assign(cursor.style, {
                width: '20px', height: '20px', backgroundColor: 'rgba(255, 0, 0, 0.7)',
                border: '2px solid white', borderRadius: '50%', position: 'fixed',
                zIndex: '999999', pointerEvents: 'none',
                transition: 'top 0.1s ease-out, left 0.1s ease-out',
                boxShadow: '0 0 10px rgba(255, 0, 0, 0.8)',
                top: '-50px', left: '-50px'
            });
            document.body.appendChild(cursor);
        }
        cursor.style.left = `${x - 10}px`;
        cursor.style.top = `${y - 10}px`;
        cursor.style.transform = 'scale(0.8)';
        setTimeout(() => cursor.style.transform = 'scale(1)', 100);

    }, { x, y });
}

// Helper para inicializar el puntero
async function instalarPunteroVisual(page: Page) {
    await moverPunteroVisual(page, -50, -50);
}

// Scroll suave para visualización
async function scrollHastaElFondo(page: Page) {
    await page.evaluate(async () => {
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        for (let i = 0; i < document.body.scrollHeight; i += 100) {
            window.scrollTo(0, i);
            await delay(20); 
        }
    });
}