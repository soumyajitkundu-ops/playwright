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
  test('Verify that the checkout process is successful upon completion', async ({
    page,
  }) => {
    // Fill in the customer details
    await page.getByRole('textbox', { name: 'First Name' }).fill('John');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
    await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');

    await page.getByRole('button', { name: 'Continue' }).click();
    // Verify that we are on checkout-step-two page
    await expect(page).toHaveURL(/.*checkout-step-two/);
    // Verify the item is still in the cart
    await expect(
      page.locator('[data-test="inventory-item-name"]')
    ).toHaveText(itemName);
    // Verify the item price is still correct
    await expect(
      page.locator('[data-test="inventory-item-price"]')
    ).toHaveText(itemPrice);
    //Click on the Finish button to complete the checkout process
    await page.getByRole('button', { name: 'Finish' }).click();
    // Verify that we are on the complete page
    await expect(page).toHaveURL(/.*checkout-complete/);
    // Verify other details on the complete page

    await expect(page.locator("//*[name()='circle' and contains(@cx,'50')]")).toBeVisible();

    await expect(page.getByText('Checkout: Complete!', { exact: true })).toBeVisible();

    await expect(
      page.getByText(
        'Your order has been dispatched, and will arrive just as fast as the TTA Express pony can get there!',
        { exact: true }
      )
    ).toBeVisible();
    //Verify cart is empty after checkout completion
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toBeHidden();


  });
  test('Verify that the Back home button works correctly', async ({
    page,
  }) => {
    // Fill in the customer details
    await page.getByRole('textbox', { name: 'First Name' }).fill('John');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
    await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');

    await page.getByRole('button', { name: 'Continue' }).click();
    // Verify that we are on checkout-step-two page
    await expect(page).toHaveURL(/.*checkout-step-two/);
    
    //Click on the Finish button to complete the checkout process
    await page.getByRole('button', { name: 'Finish' }).click();
    // Verify that we are on the complete page
    await expect(page).toHaveURL(/.*checkout-complete/);
    // Click on the Back home button to return to inventory page
    await page.getByRole('link', { name: 'Back Home' }).click();
    //Verify that we are back on the inventory page
    await expect(page).toHaveURL(/.*inventory/);

  });
});