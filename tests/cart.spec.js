import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { ItemDetailsPage } from '../pages/ItemDetailsPage.js';
import { ROUTES } from '../constants/routes.js';
import { TEST_DATA } from '../constants/testData.js';
import { login } from '../helper/loginHelper.js';

test.describe('Cart page should work as intended', () => {
  let inventoryPage, cartPage, itemDetailsPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    itemDetailsPage = new ItemDetailsPage(page);
    await login(page,inventoryPage);
  });

  test('Empty cart should display correct message', async ({ page }) => {
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(ROUTES.CART);
    await expect(cartPage.getEmptyCartMessage(TEST_DATA.messages.emptyCart)).toBeVisible();
  });

  test('Continue to shopping button should redirect to inventory page', async ({ page }) => {
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(ROUTES.CART);
    await cartPage.continueShoppingBtn.click();
    await expect(page).toHaveURL(ROUTES.INVENTORY);
  });

  test('Added item can be removed from cart', async ({ page }) => {
    const firstItem = await inventoryPage.getItemByIndex(0);
    const addToCartBtn = await inventoryPage.getAddToCartBtn(firstItem);
    await addToCartBtn.click();
    
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(ROUTES.CART);
    
    await cartPage.removeBtn.click();
    await expect(cartPage.getEmptyCartMessage(TEST_DATA.messages.emptyCart)).toBeVisible();
  });

  test('should toggle Add to cart and Remove directly on the inventory page', async () => {
    const firstItem = await inventoryPage.getItemByIndex(0);
    const addToCartBtn = await inventoryPage.getAddToCartBtn(firstItem);
    const removeBtn = await inventoryPage.getRemoveBtn(firstItem);

    await addToCartBtn.click();
    await expect(removeBtn).toBeVisible();
    await expect(addToCartBtn).toBeHidden();
    await expect(inventoryPage.cartLink).toBeVisible();

    await removeBtn.click();
    await expect(addToCartBtn).toBeVisible();
  });

  test('should maintain cart state when switching from product details to inventory', async ({ page }) => {
    const firstItemCard = await inventoryPage.getItemByIndex(0);
    await inventoryPage.clickItemTitle(firstItemCard);
    
    await itemDetailsPage.addToCartBtn.click();
    await expect(itemDetailsPage.removeBtn).toBeVisible();
    await expect(itemDetailsPage.cartLink).toBeVisible();

    await itemDetailsPage.backToProductsBtn.click();
    await expect(page).toHaveURL(ROUTES.INVENTORY);

    const firstItemCardAfterBack = await inventoryPage.getItemByIndex(0);
    await expect(await inventoryPage.getRemoveBtn(firstItemCardAfterBack)).toBeVisible();
    await expect(await inventoryPage.getAddToCartBtn(firstItemCardAfterBack)).toBeHidden();
  });

  test('should add and remove multiple items and verify cart badge count', async () => {
    const firstItem = await inventoryPage.getItemByIndex(0);
    const secondItem = await inventoryPage.getItemByIndex(1);

    await (await inventoryPage.getAddToCartBtn(firstItem)).click();
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(await inventoryPage.getRemoveBtn(firstItem)).toBeVisible();

    await (await inventoryPage.getAddToCartBtn(secondItem)).click();
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await expect(await inventoryPage.getRemoveBtn(secondItem)).toBeVisible();

    await (await inventoryPage.getRemoveBtn(firstItem)).click();
    await expect(inventoryPage.cartBadge).toHaveText('1');
    
    await (await inventoryPage.getRemoveBtn(secondItem)).click();
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});