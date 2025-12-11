import { test, expect } from '@playwright/test';

test("Validar paginación: misma cantidad de cards, nombres diferentes", async ({ page }) => {
    await page.goto("http://localhost:3000/alquiler/paginacion?page=1");
    await page.waitForTimeout(1000);

    // Seleccionamos  los títulos de card
    const cardSelector = "h2.text-2xl.font-bold.mb-1";

    // ---- Página 1 ----
    const titlesPage1 = await page.locator(cardSelector).allTextContents();
    console.log("> Página 1 - Nombres encontrados:");

    //Mostramos todos los titulos de las cards registradas en la pagina
    titlesPage1.forEach((t) => console.log("- " + t.trim()));

    //Mostramos el total de las cards mostradas
    const countPage1 = titlesPage1.length;
    console.log(`# Total cards en Página 1: ${countPage1}`);

    expect(countPage1).toBeGreaterThan(0);

    // ---- Ir a Página 2 ----
    await page.locator("//button[contains(., 'Siguiente')]").click();
    await page.waitForTimeout(1000);

    // ---- Página 2 ----
    const titlesPage2 = await page.locator(cardSelector).allTextContents();
    //Mostramos todas las cards mostradas en la pagina
    console.log("> Página 2 - Nombres encontrados:");
    titlesPage2.forEach((t) => console.log("- " + t.trim()));

    //mostramos el total de las cards en la pagina
    const countPage2 = titlesPage2.length;
    console.log(`# Total cards en Página 2: ${countPage2}`);

    // ---- Validaciones ----

    // 1. Misma cantidad de cards
    expect(countPage1).toBe(countPage2);

    // 2. Que no tengan los mismos nombres (paginación real)
    expect(titlesPage1).not.toEqual(titlesPage2);
});
