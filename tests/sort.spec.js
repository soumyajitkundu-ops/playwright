import { test, expect } from '@playwright/test';

test.describe('TTACart Inventory Sorting Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://app.thetestingacademy.com/playwright/ttacart/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByPlaceholder('Password').fill('tta_secret');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('should sort products by Name (A to Z)', async ({ page }) => {
    const sortDropdown = page.getByRole('combobox', { name: 'Sort products' });
    await sortDropdown.selectOption('az');

    await expect(async () => {
      const names = await page.locator('[data-test="inventory-item-name"]').allInnerTexts();
      expect(names.length).toBeGreaterThan(1);
    }).toPass();

    const productNames = await page.locator('[data-test="inventory-item-name"]').allInnerTexts();
    
    // FIX: Use localeCompare for true alphabetical sorting
    const expectedNames = [...productNames].sort((a, b) => a.localeCompare(b));

    expect(productNames).toEqual(expectedNames);
  });

  test('should sort products by Name (Z to A)', async ({ page }) => {
    const sortDropdown = page.getByRole('combobox', { name: 'Sort products' });
    await sortDropdown.selectOption('za');

    await expect(async () => {
      const names = await page.locator('[data-test="inventory-item-name"]').allInnerTexts();
      
      // FIX: Reverse the localeCompare order for Z to A
      const expected = [...names].sort((a, b) => b.localeCompare(a));
      
      expect(names).toEqual(expected);
    }).toPass();
  });

  test('should sort products by Price (low to high)', async ({ page }) => {
    const sortDropdown = page.getByRole('combobox', { name: 'Sort products' });
    
    await sortDropdown.selectOption('lohi');

    const priceTexts = await page.locator('[data-test="inventory-item-price"]').allInnerTexts();
    const prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
    const expectedPrices = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(expectedPrices);
  });

  test('should sort products by Price (high to low)', async ({ page }) => {
    const sortDropdown = page.getByRole('combobox', { name: 'Sort products' });
    
    await sortDropdown.selectOption('hilo');

    const priceTexts = await page.locator('[data-test="inventory-item-price"]').allInnerTexts();
    const prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
    const expectedPrices = [...prices].sort((a, b) => b - a);

    expect(prices).toEqual(expectedPrices);
  });

});