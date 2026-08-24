import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage.js';
import { ROUTES } from '../constants/routes.js';
import { TEST_DATA } from '../constants/testData.js';

test.describe('TTACart Inventory Sorting Functionality', () => {
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    
    // Inject auth script with double quotes
    await inventoryPage.setAuthSession(TEST_DATA.users.validUser);
    await inventoryPage.navigate(`${ROUTES.BASE_URL}inventory.html`);
    
    await expect(page).toHaveURL(ROUTES.INVENTORY);
  });

  test('should sort products by Name (A to Z)', async () => {
    await inventoryPage.sortProductsBy('az');

    await expect(async () => {
      const names = await inventoryPage.getAllItemNamesText();
      expect(names.length).toBeGreaterThan(1);
    }).toPass();

    const productNames = await inventoryPage.getAllItemNamesText();
    const expectedNames = [...productNames].sort((a, b) => a.localeCompare(b));
    expect(productNames).toEqual(expectedNames);
  });

  test('should sort products by Name (Z to A)', async () => {
    await inventoryPage.sortProductsBy('za');

    await expect(async () => {
      const names = await inventoryPage.getAllItemNamesText();
      const expected = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(expected);
    }).toPass();
  });

  test('should sort products by Price (low to high)', async () => {
    await inventoryPage.sortProductsBy('lohi');
    const prices = await inventoryPage.getAllItemPricesText();
    const expectedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(expectedPrices);
  });

  test('should sort products by Price (high to low)', async () => {
    await inventoryPage.sortProductsBy('hilo');
    const prices = await inventoryPage.getAllItemPricesText();
    const expectedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(expectedPrices);
  });
});