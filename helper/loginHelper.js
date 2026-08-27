import { TEST_DATA } from '../constants/testData.js';
import { ROUTES } from '../constants/routes.js';
import { expect } from '@playwright/test';
export async function login(page, inventoryPage) {
  await inventoryPage.setAuthSession(TEST_DATA.users.validUser);
  await inventoryPage.navigate(`${ROUTES.BASE_URL}inventory.html`);
  await expect(page).toHaveURL(ROUTES.INVENTORY);
  await inventoryPage.resetAppState();
}