import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ROUTES } from '../constants/routes.js';
import { TEST_DATA } from '../constants/testData.js';

test.describe('TTACart Login Functionality', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate(ROUTES.BASE_URL);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login(TEST_DATA.users.validUser, TEST_DATA.users.password);
    await expect(page).toHaveURL(ROUTES.INVENTORY);
  });

  test('should show an error with invalid credentials', async () => {
    await loginPage.login(TEST_DATA.users.invalidUser, TEST_DATA.users.invalidPassword);
    await expect(loginPage.errorAlert).toBeVisible();
  });
});