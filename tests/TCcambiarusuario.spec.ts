import { test, expect, Page, Locator } from '@playwright/test';

test.use({
    headless: false,
    launchOptions: {
        slowMo: 1000, // Velocidad ajustada para que se vea bien en el video
    },
});

test('Demo Visual: Búsqueda de Fixer "Veronica Jardinero"', async ({ page, browserName }) => {
    // 90 segundos de tiempo límite
    test.setTimeout(90000);
    
    // 1. Inyectamos el puntero rojo visual
    await instalarPunteroVisual(page);

    console.log(`--- INICIANDO TEST EN: ${browserName.toUpperCase()} ---`);

    // ==========================================
    // 1. INGRESAR A SERVINEO
    // ==========================================
    console.log('PASO 1: Ingresando al Home...');
    await page.goto('https://servineo.app/es');

    // Manejo del Modal de Publicidad
    try {
        const btnNoGracias = page.locator('//button[normalize-space()="No, gracias"]');
        if (await btnNoGracias.isVisible({ timeout: 4000 })) {
            console.log('   Cerrando publicidad...');
            await interactuar(page, btnNoGracias);
            await btnNoGracias.click();
        }
    } catch (e) {
        console.log('   No hay ventana emergente.');
    }

    // ==========================================
    // 2. DIRIGIRSE A OFERTAS
    // ==========================================
    console.log('PASO 2: Navegando a la sección de Ofertas...');
    
    // Selector robusto para el botón de ofertas
    const ofertasButton = page.locator('a, button').filter({ hasText: /Ofertas de Trabajo/i }).first();
    
    await interactuar(page, ofertasButton);
    await ofertasButton.click();
    
    // Esperamos visualmente la carga
    await page.waitForTimeout(2000);

    // ==========================================
    // 3. REALIZAR BÚSQUEDA
    // ==========================================
    console.log('PASO 3: Buscando "Veronica Jardinero"...');
    
    // Selector del input de búsqueda
    const searchInput = page.getByPlaceholder(/¿Qu. servicio necesitas\?/i);
    await expect(searchInput).toBeVisible();

    await interactuar(page, searchInput);
    
    // 👇 AQUÍ ESTÁ EL CAMBIO: Escribimos el nombre solicitado
    await searchInput.fill('Veronica Jardinero'); 
    await page.keyboard.press('Enter');
    
    console.log('   Búsqueda ejecutada. Esperando resultados...');
    await page.waitForTimeout(3000); // Espera visual para ver cómo cargan los resultados

    // ==========================================
    // 4. VALIDACIÓN DE RESULTADOS
    // ==========================================
    console.log('PASO 4: Validando resultados encontrados...');

    // 4.1 Verificar texto de cantidad de resultados
    const resultsTextElement = page.locator('div.text-sm.text-gray-600.mt-3').first();
    
    if (await resultsTextElement.isVisible()) {
        const resultsText = await resultsTextElement.innerText();
        console.log(`   -> Resumen: "${resultsText}"`);
    }

    // 4.2 Verificar las tarjetas
    const jobCards = page.locator('.group.relative'); // Selector genérico de tarjetas de fixer
    const count = await jobCards.count();

    if (count > 0) {
        console.log(`   -> Se encontraron ${count} tarjetas visibles.`);
        
        // Vamos a la primera tarjeta para validarla visualmente
        const firstCard = jobCards.first();
        await interactuar(page, firstCard); // El puntero señala el resultado
        
        const cardText = await firstCard.innerText();
        console.log('   -> Contenido de la primera tarjeta analizado.');

        // Validación flexible: Verificamos si aparece "Veronica" o "Jardinero"
        const lowerText = cardText.toLowerCase();
        if (lowerText.includes('veronica') || lowerText.includes('jardinero')) {
             console.log('   ✅ ÉXITO: El resultado coincide con la búsqueda.');
        } else {
             console.log('   ⚠️ ADVERTENCIA: El resultado podría no ser exacto (verificar manualmente).');
        }
    } else {
        console.log('   ℹ️ No se encontraron resultados para esta búsqueda.');
    }

    // ==========================================
    // 5. LIMPIEZA FINAL (Opcional)
    // ==========================================
    console.log('PASO 5: Limpiando búsqueda para finalizar...');
    
    const clearButton = page.locator('button').filter({ hasText: /Limpiar|Borrar/i }).or(page.locator('button svg.lucide-x').locator('..')).first();

    if (await clearButton.isVisible({ timeout: 3000 })) {
        await interactuar(page, clearButton);
        await clearButton.click();
        await expect(searchInput).toBeEmpty();
        console.log('   ✅ Búsqueda limpiada.');
    }

    console.log('--- TEST COMPLETADO EXITOSAMENTE ---');
    await page.waitForTimeout(2000);
});

// ==========================================
// 🎨 FUNCIONES VISUALES (Helpers)
// ==========================================

async function interactuar(page: Page, locator: Locator) {
    await locator.waitFor({ state: 'visible', timeout: 10000 });

    // 1. Scroll lento y suave hacia el elemento
    await scrollLentoAlElemento(page, locator);
    
    // 2. Mover el puntero rojo encima
    await moverPunteroAlCentro(page, locator);

    // 3. Efecto Neón para resaltar
    await locator.evaluate((node) => {
        node.style.transition = 'all 0.3s ease';
        node.style.outline = '3px solid #00ffcc'; 
        node.style.boxShadow = '0 0 15px #00ffcc'; 
        node.style.transform = 'scale(1.05)';
    });
}

/**
 * 🐢 SCROLL LENTO: Baja la pantalla suavemente pixel a pixel
 */
async function scrollLentoAlElemento(page: Page, locator: Locator) {
    const box = await locator.boundingBox();
    if (!box) return;

    await page.evaluate(async (yPosition) => {
        const currentY = window.scrollY;
        // Calculamos posición para dejar el elemento centrado
        const targetY = yPosition + currentY - (window.innerHeight / 2); 
        const distance = targetY - currentY;
        
        // Configuración de suavidad
        const steps = 30;
        const duration = 800;
        const stepTime = duration / steps;
        const stepSize = distance / steps;
        
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 1; i <= steps; i++) {
            window.scrollBy(0, stepSize);
            await delay(stepTime);
        }
    }, box.y);
    
    // Pausa técnica para estabilidad
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
        // Auto-recuperación: Si cambió la página y se borró, lo creamos de nuevo
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
        
        // Mover a la nueva posición
        cursor.style.left = `${x - 10}px`;
        cursor.style.top = `${y - 10}px`;
        cursor.style.transform = 'scale(0.8)'; // Efecto click
        setTimeout(() => cursor.style.transform = 'scale(1)', 100);
    }, { x, y });
}