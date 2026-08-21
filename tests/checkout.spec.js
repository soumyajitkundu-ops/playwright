import { test, expect } from '@playwright/test';

test.describe('Checkout page should work as intended', () => {
  let itemName;
  let itemPrice;

  test.beforeEach(async ({ page }) => {
    await page.goto('https://app.thetestingacademy.com/playwright/ttacart/');

    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByPlaceholder('Password').fill('tta_secret');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/.*inventory/);

    // Reset app state to ensure a clean slate for each test
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('link', { name: 'Reset App State' }).click();

    // Add the first item to the cart
    const firstItemCard = page
      .locator('[data-test="inventory-item"]')
      .first();

    itemName = await firstItemCard
      .locator('[data-test="inventory-item-name"]')
      .innerText();

    itemPrice = await firstItemCard
      .locator('[data-test="inventory-item-price"]')
      .innerText();

    await firstItemCard
      .getByRole('button', { name: 'Add to cart' })
      .click();

    // Click on the cart icon to visit cart page
    const cartButton = await page.locator("//*[name()='path' and contains(@d,'M3 3h2l2.4')]");
    await cartButton.click();

    await expect(page).toHaveURL(/.*cart/);
    // Click on the Checkout button to visit checkout-step-one page
    await page.getByRole('link', { name: 'Checkout' }).click();
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

  test('Cancel button should redirect to cart page with item in cart', async ({
    page,
  }) => {
    // Already on checkout-step-one because of beforeEach

    await page.getByRole('link', { name: 'Cancel' }).click();

    await expect(page).toHaveURL(/.*cart/);

    // Verify the item is still in the cart
    
    await expect(
      page.locator('[data-test="inventory-item-name"]')
    ).toHaveText(itemName);

    await expect(
      page.locator('[data-test="inventory-item-price"]')
    ).toHaveText(itemPrice);
  });
});