import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { ROUTES } from '../constants/routes.js';
import { TEST_DATA } from '../constants/testData.js';

test.describe('User should be able to log out correctly', () => {
    let inventoryPage;
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);

        // Inject auth script with double quotes
        await inventoryPage.setAuthSession(TEST_DATA.users.validUser);
        await inventoryPage.navigate(`${ROUTES.BASE_URL}inventory.html`);
        
        await expect(page).toHaveURL(ROUTES.INVENTORY);
    });

    test('user should be logged out when logout link is clicked', async ({ page }) => {
        await inventoryPage.logout();
        await expect(page).toHaveURL(ROUTES.BASE_URL);
        await expect(page).toHaveTitle('TTACart - Login');
        await expect(loginPage.loginBtn).toBeVisible();
    });
});