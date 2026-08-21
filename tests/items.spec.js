import { test, expect } from '@playwright/test';

test.describe('TTACart Item Details & Cart State Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://app.thetestingacademy.com/playwright/ttacart/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByPlaceholder('Password').fill('tta_secret');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page).toHaveURL(/.*inventory/);
    //Reset app state to ensure a clean slate for each test
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('link', { name: 'Reset App State' }).click();
  });

  test('should open item page and display correct product details dynamically', async ({ page }) => {
    const firstItemCard = page.locator('[data-test="inventory-item"]').first();
    const expectedName = await firstItemCard.locator('[data-test="inventory-item-name"]').innerText();
    const expectedDesc = await firstItemCard.locator('[data-test="inventory-item-desc"]').innerText();
    const expectedPrice = await firstItemCard.locator('[data-test="inventory-item-price"]').innerText();

    await firstItemCard.locator('[data-test="inventory-item-name"] a').click();
    
    await expect(page).toHaveURL(/.*inventory-item\?id=.*/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(expectedName);
    await expect(page.locator('[data-test="inventory-item-desc"]')).toHaveText(expectedDesc);
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(expectedPrice);
  });

  
  

});