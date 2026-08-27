export class BasePage {
    constructor(page) {
        this.page = page;
        this.menuBtn = page.getByRole('button', { name: 'Open menu' });
        this.closeMenuBtn = page.getByRole('button', { name: 'Close menu' });
        this.menuContainer = page.getByRole('complementary');
        this.resetAppStateLink = page.getByRole('link', { name: 'Reset App State' });
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.aboutLink = page.getByRole('link', { name: 'About' });
        this.allItemsLink = page.getByRole('link', { name: 'All Items' });
        this.cartIconBtn = page.locator('[id="shopping_cart_container"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartLink = page.getByRole('link', { name: 'Shopping cart' });
    }

    /**
     * Bypasses UI login by injecting localStorage and sessionStorage with double quotes
     */
    async setAuthSession(username) {
        await this.page.addInitScript((user) => {
            // Forces the value to be "standard_user" (with quotes)
            const storedValue = `"${user}"`; 
            window.localStorage.setItem('tta-cart-user', storedValue);
            window.sessionStorage.setItem('tta-cart-user', storedValue);
            window.sessionStorage.setItem('session-username', storedValue);
        }, username);
    }

    async navigate(url) {
        await this.page.goto(url);
    }

    async openMenu() {
        await this.menuBtn.click();
    }

    async closeMenu() {
        await this.closeMenuBtn.click();
    }

    async resetAppState() {
        await this.openMenu();
        await this.resetAppStateLink.click();
    }

    async goToCart() {
        await this.cartIconBtn.click();
    }

    async logout() {
        await this.openMenu();
        await this.logoutLink.click();
    }
}