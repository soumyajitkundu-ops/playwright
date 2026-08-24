import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
    constructor(page) {
        super(page);
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.sortDropdown = page.getByRole('combobox', { name: 'Sort products' });
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    }

    async getItemByIndex(index) {
        return this.inventoryItems.nth(index);
    }

    async clickItemTitle(itemLocator) {
        await itemLocator.locator('[data-test="inventory-item-name"] a').click();
    }

    async getAddToCartBtn(itemLocator) {
        return itemLocator.getByRole('button', { name: 'Add to cart' });
    }

    async getRemoveBtn(itemLocator) {
        return itemLocator.getByRole('button', { name: 'Remove' });
    }

    async sortProductsBy(optionValue) {
        await this.sortDropdown.selectOption(optionValue);
    }

    async getAllItemNamesText() {
        return await this.itemNames.allInnerTexts();
    }

    async getAllItemPricesText() {
        const priceTexts = await this.itemPrices.allInnerTexts();
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }
}