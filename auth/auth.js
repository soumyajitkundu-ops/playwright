import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // 1. Navigate to the root URL first to establish the origin
  await page.goto('https://app.thetestingacademy.com/playwright/ttacart/');
  await page.waitForLoadState('networkidle');

  // 2. Inject the tokens with guaranteed double quotes using JSON.stringify
  await page.evaluate(() => {
    const userValue = JSON.stringify('standard_user'); // Evaluates precisely to: "standard_user"
    window.localStorage.setItem('tta-cart-user', userValue);
    window.sessionStorage.setItem('tta-cart-user', userValue);
  });

  // 3. Save the generated storage state to disk
  await page.context().storageState({ path: authFile });
});