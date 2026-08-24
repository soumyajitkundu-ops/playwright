import { BasePage } from './BasePage';

export class ItemDetailsPage extends BasePage {
    constructor(page) {
        super(page);
        this.itemName = page.locator('[data-test="inventory-item-name"]');
        this.itemDesc = page.locator('[data-test="inventory-item-desc"]');
        this.itemPrice = page.locator('[data-test="inventory-item-price"]');
        this.addToCartBtn = page.getByRole('button', { name: 'Add to cart' });
        this.removeBtn = page.getByRole('button', { name: 'Remove' });
        this.backToProductsBtn = page.locator('[data-test="back-to-products"]');
    }
}