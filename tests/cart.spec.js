import { test, expect } from '@playwright/test';

test.describe('Cart page should work as intended', () => {
  
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

test('Empty cart should display correct message', async ({ page }) => {
    // Click on the cart icon to visit cart page
    const cartButton = await page.locator("//*[name()='path' and contains(@d,'M3 3h2l2.4')]");
    await cartButton.click();
    await expect(page).toHaveURL(/.*cart/);
    await expect(page.getByText('Your cart is empty.', { exact: true })).toBeVisible();
});
test('Continue to shopping buton should redirect to inventory page', async ({ page }) => {
    // Click on the cart icon to visit cart page
    const cartButton = await page.locator("//*[name()='path' and contains(@d,'M3 3h2l2.4')]");
    await cartButton.click();
    await expect(page).toHaveURL(/.*cart/);
    // Click on the Continue to shopping button
    await page.getByRole('link', { name: 'Continue Shopping' }).click();
    await expect(page).toHaveURL(/.*inventory/);
});
test('Added item can be removed from cart', async ({ page }) => {
    //Pick the first item in the inventory grid 
    const firstItemCard = page.locator('[data-test="inventory-item"]').first();
    const addToCartBtn = firstItemCard.getByRole('button', { name: 'Add to cart' });
    // Click Add to cart
    await addToCartBtn.click();
    
    // Click on the cart icon to visit cart page
    const cartButton = page.locator("//*[name()='path' and contains(@d,'M3 3h2l2.4')]");
    await cartButton.click();
    await expect(page).toHaveURL(/.*cart/);
    
    // Verify the empty cart message works when the only item is removed from the cart
    const removeBtn = await page.getByRole('button', { name: 'Remove' });
    await removeBtn.click();
    
    await expect(page.getByText('Your cart is empty.', { exact: true })).toBeVisible();
});
  test('should toggle Add to cart and Remove directly on the inventory page', async ({ page }) => {
    const firstItemCard = page.locator('[data-test="inventory-item"]').first();
    const addToCartBtn = firstItemCard.getByRole('button', { name: 'Add to cart' });
    const removeBtn = firstItemCard.getByRole('button', { name: 'Remove' });

    // Click Add to cart
    await addToCartBtn.click();

    // Verify button converts to Remove
    await expect(removeBtn).toBeVisible();
    await expect(addToCartBtn).toBeHidden();

    // Verify Shopping cart link/icon is visible and active
    await expect(page.getByRole('link', { name: 'Shopping cart' })).toBeVisible();

    // Click Remove and verify it reverts
    await removeBtn.click();
    await expect(addToCartBtn).toBeVisible();
  });

  test('should maintain cart state when switching from product details to inventory', async ({ page }) => {
    // 1. Navigate to the first item's details page
    const firstItemCard = page.locator('[data-test="inventory-item"]').first();
    await firstItemCard.locator('[data-test="inventory-item-name"] a').click();
    
    // 2. Add the item to the cart from the details page
    const detailsAddToCartBtn = page.getByRole('button', { name: 'Add to cart' });
    const detailsRemoveBtn = page.getByRole('button', { name: 'Remove' });
    
    await detailsAddToCartBtn.click();
    
    // 3. Verify it toggled to Remove and the cart icon updated
    await expect(detailsRemoveBtn).toBeVisible();
    await expect(page.getByRole('link', { name: 'Shopping cart' })).toBeVisible();

    // 4. Click Back to return to the inventory grid
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/.*inventory/);

    // 5. Verify the state persisted: The first item on the grid should now say "Remove"
    const firstItemCardAfterBack = page.locator('[data-test="inventory-item"]').first();
    await expect(firstItemCardAfterBack.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(firstItemCardAfterBack.getByRole('button', { name: 'Add to cart' })).toBeHidden();
  });
  test('should add and remove multiple items and verify cart badge count', async ({ page }) => {
    // 1. Target the first and second items in the grid
    const firstItem = page.locator('[data-test="inventory-item"]').nth(0);
    const secondItem = page.locator('[data-test="inventory-item"]').nth(1);
    
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // 2. Add the first item to the cart
    await firstItem.getByRole('button', { name: 'Add to cart' }).click();
    
    // Verify badge shows '1' and button changed to Remove
    await expect(cartBadge).toHaveText('1');
    await expect(firstItem.getByRole('button', { name: 'Remove' })).toBeVisible();

    // 3. Add the second item to the cart
    await secondItem.getByRole('button', { name: 'Add to cart' }).click();
    
    // Verify badge increments to '2' and second button changed to Remove
    await expect(cartBadge).toHaveText('2');
    await expect(secondItem.getByRole('button', { name: 'Remove' })).toBeVisible();

    // 4. Remove the first item
    await firstItem.getByRole('button', { name: 'Remove' }).click();
    
    // Verify badge decrements back to '1'
    await expect(cartBadge).toHaveText('1');
    await expect(firstItem.getByRole('button', { name: 'Add to cart' })).toBeVisible();

    // 5. Remove the second item
    await secondItem.getByRole('button', { name: 'Remove' }).click();
    
    // Verify the badge disappears entirely when the cart is empty
    await expect(cartBadge).toBeHidden();
  });
  

});