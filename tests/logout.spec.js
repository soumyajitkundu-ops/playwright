import { test, expect } from '@playwright/test';

test.describe('User should be able to log out correctly', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://app.thetestingacademy.com/playwright/ttacart/');
        await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
        await page.getByPlaceholder('Password').fill('tta_secret');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL(/.*inventory/);
    });

    test('user should be logged out when logout link is clicked', async ({ page }) => {
        // Click the hamburger menu using its accessibility label
        await page.getByRole('button', { name: 'Open menu' }).click();
        await page.getByRole('link', { name: 'Logout' }).click();
        // Verify the exact URL
        await expect(page).toHaveURL('https://app.thetestingacademy.com/playwright/ttacart/');

        // Verify the page title matches the browser tab
        await expect(page).toHaveTitle('TTACart - Login');
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });


});