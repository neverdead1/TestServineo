import {test, expect} from '@playwright/test';

test.describe("Normalización de mayúsculas al buscar", () => {

  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`Test en ${browserName}`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      try {
        //1. Ingresar a Servineo
        await page.goto('https://servineo.app/es');

        //Cerrar ventana emergente si aparece
        try {
        await page.locator('//button[normalize-space()="No, gracias"]').click({ timeout: 5000 });
        console.log('✓ Ventana cerrada');
        await (2000);
      } catch (e) {
        console.log('✓ No hay ventana emergente');
      }
        
        //2. Dirigirse a la sección de búsqueda
        const ofertasButton = page.locator('a, button').filter({
          hasText: /Ofertas de Trabajo/i
        }).first();
        
        await expect(ofertasButton).toBeVisible();
        await ofertasButton.click();
        await (3000);

        //3. Buscar el parámetro electricista
        const searchInput = page.locator("//input[@placeholder='¿Que servicio necesitas?']");
        await expect(searchInput).toBeVisible();

        await searchInput.click();
        await searchInput.fill('electricista');
        await page.keyboard.press('Enter');
        /*await page.locator("button[type='submit']").click();*/ 
        
        await page.waitForTimeout(2000);
        
        //3.1. Verificar los resultados mostrados
        const resultsTextElement = page.locator('div.text-sm.text-gray-600.mt-3');
        await expect(resultsTextElement).toBeVisible();
        
        const resultsText1 = await resultsTextElement.textContent();
        console.log(`Texto de resultados (electricista): ${resultsText1}`);
        
        let totalResults1 = 0;
        if (resultsText1) {
          const match = resultsText1.match(/de\s+(\d+)\s+resultados/);
          if (match) {
            totalResults1 = parseInt(match[1], 10);
          }
        }
        
        console.log(`Total de resultados para "electricista": ${totalResults1}`);
        expect(totalResults1).toBeGreaterThan(0);
        
        // 4. Limpiar búsqueda
        const clearButton = page.locator('button[aria-label="Limpiar búsqueda"]').first();
        if (await clearButton.isVisible()) {
          await clearButton.click();
          expect(searchInput).toHaveValue('');
        } else {
          await searchInput.click();
          await page.keyboard.press('Control+A');
          await page.keyboard.press('Delete');
        }
        // 5. Buscar el parámetro "ElEcTRIcIsTa"
        await searchInput.fill('ElEcTRIcIsTa');
        await page.keyboard.press('Enter');
        
        await page.waitForTimeout(2000);
        
        const resultsText2 = await resultsTextElement.textContent();
        console.log(`Texto de resultados (ElEcTRIcIsTa): ${resultsText2}`);
        
        let totalResults2 = 0;
        if (resultsText2) {
          const match = resultsText2.match(/de\s+(\d+)\s+resultados/);
          if (match) {
            totalResults2 = parseInt(match[1], 10);
          }
        }
        
        console.log(`Total de resultados para "ElEcTRIcIsTa": ${totalResults2}`);
        
        expect(totalResults1).toBe(totalResults2);

        const jobCards = page.locator('.group.relative.w-full.overflow-hidden.rounded-2xl.border');
        const visibleCardCount = await jobCards.count();
        
        if (visibleCardCount > 0) {
          const firstCard = jobCards.first();
          const title = await firstCard.locator('h3').textContent();
          expect(title?.toLowerCase()).toContain('electricista');
        }
        
        console.log('\n✅ Test completado exitosamente');
        
      } catch (error) {
        console.error('❌ Error en el test:', error);
        
        await page.screenshot({ 
          path: `error-${Date.now()}.png`,
          fullPage: true 
        });
        
        throw error;
      } finally {
        await context.close();
      }
    });
  });
});