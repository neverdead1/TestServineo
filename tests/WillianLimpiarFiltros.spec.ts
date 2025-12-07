import { test, expect, Page, Locator } from '@playwright/test';
/**
 * *Hecho por Willian Andres Almendras Calizaya
 * *https://app.qase.io/case/SERVINOD-561
 */

test.use({
    headless: false,
    launchOptions: {
        slowMo: 800, 
    },
});

test('Verificar que el botón "Limpiar Datos" desmarca el filtro "Palabras Exactas" en Búsqueda Avanzada', async ({ page, browserName }) => {
    // Tiempo suficiente para la demo visual
    test.setTimeout(60000); 

    // Inyectamos el puntero rojo
    await instalarPunteroVisual(page);

    console.log(`--- INICIANDO TEST EN: ${browserName.toUpperCase()} ---`);

    // PARTE 1: NAVEGACION DESDE HOME

    console.log('PASO 1: Ingresar al link de la pagina');
    await page.goto('https://servineo.app/es');

    try {
        console.log('PASO 2: Hacer clic en el boton "No, gracias".');
        const btnNoGracias = page.locator('//button[normalize-space()="No, gracias"]');
        if (await btnNoGracias.isVisible({ timeout: 4000 })) {
            await interactuar(page, btnNoGracias);
            await btnNoGracias.click();
        }
    } catch (e) {}

    // Ir a Ofertas
    console.log('PASO 3: Hacer clic en la sección "Ofertas de trabajo"');
    const linkOfertas = page.locator('//a[contains(@href, "job-offer-list")]').first();
    await interactuar(page, linkOfertas);
    await linkOfertas.click();

    // Ir a Busqueda Avanzada
    console.log('PASO 4: Hacer clic en el botón de "Búsqueda Avanzada"');
    const btnLupa = page.locator('button[aria-label="Go to advanced search"]');
    await interactuar(page, btnLupa);
    await btnLupa.click();

    console.log('   Esperando carga...');
    await page.waitForURL('**/adv-search', { timeout: 10000 });
    await expect(page.locator('input[value="specific"]')).toBeVisible();

    // PARTE 2: SOLO MARCAR "PALABRAS EXACTAS"

    console.log('PASO 5: Marcar el checkbox de palabras exactas');

    const checkPalabras = page.locator('label').filter({ hasText: 'Palabras Exactas' }).first();
    await interactuar(page, checkPalabras);
    await checkPalabras.click();
    console.log('   -> Checkbox activado.');

    // PARTE 3: LIMPIEZA Y VERIFICACIÓN VISUAL

    console.log('PASO 6: Hacer clic en el boton "limpiar datos"');
    const btnLimpiar = page.getByRole('button', { name: 'Limpiar Datos' });
    await interactuar(page, btnLimpiar);
    await btnLimpiar.click();

    console.log('PASO 7: Verificar que desmarco el checkbox "Palabras exactas"');

    // 1. Usamos el scroll lento para volver a subir hasta el checkbox
    await scrollLentoAlElemento(page, checkPalabras);
    
    // 2. Movemos el puntero rojo de vuelta al checkbox
    await moverPunteroAlCentro(page, checkPalabras);

    // 3. ILUMINACION VERDE DE "VERIFICADO"
    // Le ponemos borde verde y fondo verde suave para indicar exito
    await checkPalabras.evaluate((node) => {
        node.style.transition = 'all 0.5s ease';
        node.style.border = '3px solid #28a745';
        node.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
        node.style.transform = 'scale(1.1)';
    });

    console.log('   ->CHECKBOX VERIFICADO VISUALMENTE (VERDE).');
    await page.waitForTimeout(2000);

    // 4. Validación tecnica real
    const inputPalabras = checkPalabras.locator('input[type="checkbox"]');
    await expect(inputPalabras).not.toBeChecked();

    console.log('TEST FINALIZADO');
    await page.waitForTimeout(1000);
});

// FUNCIONES VISUALES AVANZADAS

async function interactuar(page: Page, locator: Locator) {
    await locator.waitFor({ state: 'visible', timeout: 10000 });

    // Scroll lento y suave
    await scrollLentoAlElemento(page, locator);
    
    // Mover puntero
    await moverPunteroAlCentro(page, locator);

    // Efecto Neon (Azul/Cian para acciones normales)
    await locator.evaluate((node) => {
        node.style.transition = 'all 0.3s ease';
        node.style.outline = '3px solid #00ffcc'; 
        node.style.boxShadow = '0 0 15px #00ffcc'; 
        node.style.transform = 'scale(1.05)';
    });
}

/**
 * SCROLL LENTO REAL
 */
async function scrollLentoAlElemento(page: Page, locator: Locator) {
    const box = await locator.boundingBox();
    if (!box) return;

    await page.evaluate(async (yPosition) => {
        const currentY = window.scrollY;
        const targetY = yPosition + currentY - (window.innerHeight / 2); 
        const distance = targetY - currentY;
        const steps = 40;
        const duration = 800;
        const stepTime = duration / steps;
        const stepSize = distance / steps;

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 1; i <= steps; i++) {
            window.scrollBy(0, stepSize);
            await delay(stepTime);
        }
    }, box.y);
    
    await page.waitForTimeout(300);
}

async function moverPunteroAlCentro(page: Page, locator: Locator) {
    const box = await locator.boundingBox();
    if (box) {
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        await moverPunteroVisual(page, x, y);
    }
}

async function instalarPunteroVisual(page: Page) {
    await page.evaluate(() => {
        const cursor = document.createElement('div');
        cursor.id = 'playwright-cursor';
        Object.assign(cursor.style, {
            width: '20px', height: '20px', backgroundColor: 'rgba(255, 0, 0, 0.8)',
            border: '2px solid white', borderRadius: '50%', position: 'fixed',
            zIndex: '999999', pointerEvents: 'none',
            transition: 'top 0.3s ease-out, left 0.3s ease-out', 
            boxShadow: '0 0 10px rgba(255, 0, 0, 0.8)',
            top: '-50px', left: '-50px'
        });
        document.body.appendChild(cursor);
    });
}

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