import { test, expect } from '@playwright/test';

test.describe('flyout should appear and disappear correctly', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://app.thetestingacademy.com/playwright/ttacart/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByPlaceholder('Password').fill('tta_secret');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('flyout items should be visible when menu is clicked', async ({ page }) => {
    // Click the hamburger menu using its accessibility label
    await page.getByRole('button', { name: 'Open menu' }).click();
    
    // Verify the menu container (<aside> tag maps to 'complementary' role) is visible
    await expect(page.getByRole('complementary')).toBeVisible();

    // Verify all individual links are visible inside the flyout
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reset App State' })).toBeVisible();
  });
  test('flyout should disappear when clicking the close button', async ({ page }) => {
    // Click the hamburger menu using its accessibility label
    await page.getByRole('button', { name: 'Open menu' }).click();
    
    // Verify the menu container gets the 'is-open' class
    await expect(page.getByRole('complementary')).toHaveClass(/is-open/);

    // Verify all individual links are visible inside the flyout
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reset App State' })).toBeVisible();

    // Click the cross button to close the menu
    await page.getByRole('button', { name: 'Close menu' }).click();

    // Explicitly verify the 'is-open' class has been removed
    await expect(page.getByRole('complementary')).not.toHaveClass(/is-open/);
  });
  test('reset app state should clear cart and reset inventory', async ({ page }) => {
    // Add the first two items to the cart
    const firstItem = page.locator('[data-test="inventory-item"]').nth(0);
    const secondItem = page.locator('[data-test="inventory-item"]').nth(1);
    await firstItem.getByRole('button', { name: 'Add to cart' }).click();
    await secondItem.getByRole('button', { name: 'Add to cart' }).click();
    //expect the cart badge to show 2 items
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveText('2');
    // Click the hamburger menu using its accessibility label
    await page.getByRole('button', { name: 'Open menu' }).click();
    //Click the Reset App State link
    await page.getByRole('link', { name: 'Reset App State' }).click();
    // Verify the menu container is closed and the 'is-open' class has been removed
    await expect(page.getByRole('complementary')).not.toHaveClass(/is-open/);

    // Verify the cart badge is no longer visible
    await expect(cartBadge).toBeHidden();

    // Verify the inventory items are reset to their initial state (Add to cart buttons are visible)
    await expect(firstItem.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    await expect(secondItem.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });
  test('About should redirect to correct url', async ({ page }) => {
    // Click the hamburger menu using its accessibility label
    await page.getByRole('button', { name: 'Open menu' }).click();
    // Click the About link
    page.getByRole('link', { name: 'About' }).click();
    // Verify the page redirects to the correct URL
    await expect(page).toHaveURL('https://app.thetestingacademy.com/');
  });

});