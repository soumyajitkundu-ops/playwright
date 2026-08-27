import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage.js';
import { ItemDetailsPage } from '../pages/ItemDetailsPage.js';
import { ROUTES } from '../constants/routes.js';
import { TEST_DATA } from '../constants/testData.js';
import { login } from '../helper/loginHelper.js';

test.describe('TTACart Item Details & Cart State Functionality', () => {
  let inventoryPage, itemDetailsPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    itemDetailsPage = new ItemDetailsPage(page);

    await login(page,inventoryPage);
  });

  test('should open item page and display correct product details dynamically', async ({ page }) => {
    const firstItemCard = await inventoryPage.getItemByIndex(0);
    const expectedName = await firstItemCard.locator('[data-test="inventory-item-name"]').innerText();
    const expectedDesc = await firstItemCard.locator('[data-test="inventory-item-desc"]').innerText();
    const expectedPrice = await firstItemCard.locator('[data-test="inventory-item-price"]').innerText();

    await inventoryPage.clickItemTitle(firstItemCard);
    
    await expect(page).toHaveURL(/.*inventory-item\?id=.*/);
    await expect(itemDetailsPage.itemName).toHaveText(expectedName);
    await expect(itemDetailsPage.itemDesc).toHaveText(expectedDesc);
    await expect(itemDetailsPage.itemPrice).toHaveText(expectedPrice);
  });
});