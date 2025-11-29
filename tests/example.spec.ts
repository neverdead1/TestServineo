import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

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
