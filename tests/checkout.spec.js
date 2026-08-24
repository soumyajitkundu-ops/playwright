import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { ROUTES } from '../constants/routes.js';
import { TEST_DATA } from '../constants/testData.js';

test.describe('Checkout page should work as intended', () => {
  let inventoryPage, cartPage, checkoutPage;
  let itemName, itemPrice;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Inject auth script with double quotes
    await inventoryPage.setAuthSession(TEST_DATA.users.validUser);
    await inventoryPage.navigate(`${ROUTES.BASE_URL}inventory.html`);
    
    await expect(page).toHaveURL(ROUTES.INVENTORY);
    await inventoryPage.resetAppState();

    const firstItemCard = await inventoryPage.getItemByIndex(0);
    itemName = await firstItemCard.locator('[data-test="inventory-item-name"]').innerText();
    itemPrice = await firstItemCard.locator('[data-test="inventory-item-price"]').innerText();

    const addToCartBtn = await inventoryPage.getAddToCartBtn(firstItemCard);
    await addToCartBtn.click();

    await inventoryPage.goToCart();
    await expect(page).toHaveURL(ROUTES.CART);
    
    await cartPage.checkoutBtn.click();
    await expect(page).toHaveURL(ROUTES.CHECKOUT_STEP_ONE);
  });

  test('Cancel button should redirect to cart page with item in cart', async ({ page }) => {
    await checkoutPage.cancelBtn.click();
    await expect(page).toHaveURL(ROUTES.CART);
    await expect(cartPage.itemName).toHaveText(itemName);
    await expect(cartPage.itemPrice).toHaveText(itemPrice);
  });

  test('Verify that the checkout process is successful upon completion', async ({ page }) => {
    await checkoutPage.fillCheckoutDetails(
        TEST_DATA.checkout.firstName, 
        TEST_DATA.checkout.lastName, 
        TEST_DATA.checkout.zipCode
    );
    
    await expect(page).toHaveURL(ROUTES.CHECKOUT_STEP_TWO);
    await expect(checkoutPage.itemName).toHaveText(itemName);
    await expect(checkoutPage.itemPrice).toHaveText(itemPrice);
    
    await checkoutPage.finishBtn.click();
    await expect(page).toHaveURL(ROUTES.CHECKOUT_COMPLETE);
    
    await expect(checkoutPage.successIcon).toBeVisible();
    await expect(checkoutPage.getSuccessMessage(TEST_DATA.messages.checkoutComplete)).toBeVisible();
    await expect(checkoutPage.getSuccessMessage(TEST_DATA.messages.dispatchMessage)).toBeVisible();
    await expect(checkoutPage.cartBadge).toBeHidden();
  });

  test('Verify that the Back home button works correctly', async ({ page }) => {
    await checkoutPage.fillCheckoutDetails(
        TEST_DATA.checkout.firstName, 
        TEST_DATA.checkout.lastName, 
        TEST_DATA.checkout.zipCode
    );
    
    await checkoutPage.finishBtn.click();
    await checkoutPage.backHomeBtn.click();
    await expect(page).toHaveURL(ROUTES.INVENTORY);
  });
});