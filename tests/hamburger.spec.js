import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { ROUTES } from '../constants/routes.js';
import { TEST_DATA } from '../constants/testData.js';

test.describe('flyout should appear and disappear correctly', () => {
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.navigate(ROUTES.BASE_URL);
    await loginPage.login(TEST_DATA.users.validUser, TEST_DATA.users.password);
    await expect(page).toHaveURL(ROUTES.INVENTORY);
  });

  test('flyout items should be visible when menu is clicked', async () => {
    await inventoryPage.openMenu();
    await expect(inventoryPage.menuContainer).toBeVisible();
    await expect(inventoryPage.allItemsLink).toBeVisible();
    await expect(inventoryPage.aboutLink).toBeVisible();
    await expect(inventoryPage.logoutLink).toBeVisible();
    await expect(inventoryPage.resetAppStateLink).toBeVisible();
  });

  test('flyout should disappear when clicking the close button', async () => {
    await inventoryPage.openMenu();
    await expect(inventoryPage.menuContainer).toHaveClass(/is-open/);
    await inventoryPage.closeMenu();
    await expect(inventoryPage.menuContainer).not.toHaveClass(/is-open/);
  });

  test('reset app state should clear cart and reset inventory', async () => {
    const firstItem = await inventoryPage.getItemByIndex(0);
    const secondItem = await inventoryPage.getItemByIndex(1);
    
    await (await inventoryPage.getAddToCartBtn(firstItem)).click();
    await (await inventoryPage.getAddToCartBtn(secondItem)).click();
    await expect(inventoryPage.cartBadge).toHaveText('2');
    
    await inventoryPage.resetAppState();
    await expect(inventoryPage.menuContainer).not.toHaveClass(/is-open/);
    await expect(inventoryPage.cartBadge).toBeHidden();
    
    await expect(await inventoryPage.getAddToCartBtn(firstItem)).toBeVisible();
    await expect(await inventoryPage.getAddToCartBtn(secondItem)).toBeVisible();
  });

  test('About should redirect to correct url', async ({ page }) => {
    await inventoryPage.openMenu();
    await inventoryPage.aboutLink.click();
    await expect(page).toHaveURL(ROUTES.ABOUT_REDIRECT);
  });
});