import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    constructor(page) {
        super(page);
        this.continueShoppingBtn = page.getByRole('link', { name: 'Continue Shopping' });
        this.checkoutBtn = page.getByRole('link', { name: 'Checkout' });
        this.removeBtn = page.getByRole('button', { name: 'Remove' });
        this.itemName = page.locator('[data-test="inventory-item-name"]');
        this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    }
    
    getEmptyCartMessage(exactText) {
        return this.page.getByText(exactText, { exact: true });
    }
}