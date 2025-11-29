import { test, expect } from '@playwright/test';

//Test case Jhoan integracion con cards "SERVINOD-492 3er Sprint"
test("Test Integracion", async ({ page }) => {
  await page.goto("https://devmasters-servineo-frontend-zk3q.vercel.app/es");

  
  await page.locator("//input[@placeholder='¿Que servicio necesitas?']").fill("Madera");
  await page.locator("button[type='submit']").click();

  
  const card = page.locator("//div[@class='flex flex-col gap-4']/div[2]");
  await card.waitFor();
  await card.click();

  
  await page.locator("//button[@aria-label='Cerrar modal']").click();


  await page.locator("body > div:nth-child(14) > div:nth-child(1) > button:nth-child(1)").click();

 
  await page.locator("//body/main/div/div/div[2]/div[1]/div[1]").click();


  await page.locator("//label[1]//div[1]//input[1]").click();
  await page.locator("//label[2]//div[1]//input[1]").click();
  await page.locator("//label[3]//div[1]//input[1]").click();


  await page.locator("//button[normalize-space()='Resetear']").click();

  
  await page.locator("body").click();

  await card.click();
  await page.waitForTimeout(3000);
});

//Test SERVINOD-51      Verificar que al ingresar "-" entre palabras no se alteren las busquedas
test("Test caracteres input", async ({ page }) => {
  await page.goto("https://devmasters-servineo-frontend-zk3q.vercel.app/es");
  await page.locator("button[type='submit']").click();

  await page.waitForTimeout(3000);

  await page.locator("//input[@placeholder='¿Qué servicio necesitas?']").fill("Alba------ñil");
  await page.locator("body > div:nth-child(14) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)").click();
  
  await page.waitForTimeout(1000);

  await page.locator("//button[@aria-label='Limpiar búsqueda']//*[name()='svg']").click();
  //Segunda prueba

  await page.locator("//input[@placeholder='¿Qué servicio necesitas?']").fill("------Albañil");
  await page.locator("body > div:nth-child(14) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)").click();
  
  await page.waitForTimeout(2000);

  await page.locator("//button[@aria-label='Limpiar búsqueda']//*[name()='svg']").click();

  //tercera prueba
  await page.locator("//input[@placeholder='¿Qué servicio necesitas?']").fill("Albañil------");
  await page.locator("body > div:nth-child(14) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)").click();
  
  await page.waitForTimeout(2000);
});
