import { test, expect } from '@playwright/test';

test.describe('TTACart Login Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the base URL (TTACart login page)
    await page.goto('https://app.thetestingacademy.com/playwright/ttacart/');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill in username and password
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByPlaceholder('Password').fill('tta_secret');
    
    // Click the login button
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify successful redirection to the inventory page
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('should show an error with invalid credentials', async ({ page }) => {
    // Fill in incorrect details
    await page.getByRole('textbox', { name: 'Username' }).fill('invalid_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    
    // Click login
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify error message container appears
    const errorMessage = await page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
  });

});