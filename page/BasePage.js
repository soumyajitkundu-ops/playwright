class BasePage {
  constructor(page) {
    this.page = page;

    this.createBtn = page.getByRole('link', { name: 'Create' });
    this.addBtn = page.getByRole('link', { name: 'Add' });
    this.importBtn = page.getByRole('link', { name: 'Import' });
    this.filterBtn = page.getByRole('button', { name: 'Filter' });
    this.applyBtn = page.getByRole('button', { name: 'Apply' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });
    this.searchBar = page.getByTestId('search-form').locator("input");
    this.clearSearchButton = page.locator('[data-testid="search-form"] button');
    this.kebabBtn = page.locator('#see-more-options');
    this.exportBtn = page.getByRole('button', { name: 'Export' });
    this.generateROPABtn = page.getByRole('button', { name: 'Generate ROPA' });
    this.viewAllBtn = page.getByRole('link', { name: 'View All' });
    this.viewMoreBtn = page.getByRole('button', { name: 'View More' });
    this.fileUploadBtn = page.getByTestId('file-upload');
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.saveBtn = page.getByRole('button', { name: 'Save' });
    this.submitBtn = page.getByRole('button', { name: 'Submit' });
    this.addManuallyBtn = page.getByRole('button', { name: 'Add Manually' });
    this.bulkUploadBtn = page.getByRole('button', { name: 'Bulk Upload' });
    this.expandEditor = page.getByTitle('Expand editor');
    this.toggleBtn = page.getByTestId('flowbite-toggleswitch-toggle');
    this.table = page.getByTestId('table-element');
    this.tableRows = page.locator('tbody tr');
    this.selectedRow = page.locator('tbody tr[data-selected="true"]');
    this.createFlyout = page.locator('div._drawer_6n5kk_8');
    this.closeBtn = page.locator('button._closeButton_6n5kk_76');
    this.tabContainer = page.locator('ul.sticky');
    this.emptyTableRow = this.tableRows.first();
    this.myTasksCard = page.getByTestId('my-tasks-card');


    this.integrationsCard = page.getByRole('heading', { name: 'Integrations Summary' });

    // Show Pages
    this.integrationShowpage = page.getByTestId('integration-show-page');

    // Table pages descriptions
    this.description    = page.getByRole('heading');

    // Pagination Footer
    this.footer = page.locator('div.bottom-0');

  }

  async clickKebab(){
    await this.kebabBtn.click();
  }

  async clickExport() {
    await this.kebabBtn.click();
    await this.exportBtn.click();
  }

  async clickCreate(){
    await this.createBtn.click();
  }

  async clickAdd(){
    await this.addBtn.click();
  }

  async clickAddManually(){
    await this.addManuallyBtn.click();
  }

  async clickSubmit(){
    await this.submitBtn.click();
  }

  async getRowCount() {
    return await this.tableRows.count();
  }

  // The table row whose nth cell holds exactly this text. Anchored so a value that
  // prefixes another ('SRK 3' vs 'SRK 38') cannot match the wrong row, and matched
  // on a chosen column rather than on the row as a whole, so an identifier is never
  // confused with the same text appearing in a different cell.
  tableRowByCell(index, text) {
    const exactText = new RegExp(`^\\s*${escapeForRegExp(text)}\\s*$`);
    return this.tableRows.filter({
      has: this.page.locator(`td:nth-child(${index + 1})`, { hasText: exactText }),
    });
  }

  tableColumn(name) {
    return this.page.getByRole('columnheader', { name , exact: true });
  }

  sidePanelFlyout(name) {
    return this.createFlyout.getByRole('heading', { name });
  }

  card(name) {
    return this.page.getByRole('heading', { name });
  }

  getTab(label) {
    return this.tabContainer.getByRole('link', { name: label, exact: true });
  }

}

module.exports = { BasePage };