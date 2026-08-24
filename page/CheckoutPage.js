import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.zipInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
        this.continueBtn = page.getByRole('button', { name: 'Continue' });
        this.finishBtn = page.getByRole('button', { name: 'Finish' });
        this.cancelBtn = page.getByRole('link', { name: 'Cancel' });
        this.backHomeBtn = page.getByRole('link', { name: 'Back Home' });
        this.successIcon = page.locator("//*[name()='circle' and contains(@cx,'50')]");
        this.itemName = page.locator('[data-test="inventory-item-name"]');
        this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    }

    async fillCheckoutDetails(firstName, lastName, zipCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipInput.fill(zipCode);
        await this.continueBtn.click();
    }
    
    getSuccessMessage(text) {
        return this.page.getByText(text, { exact: true });
    }
}