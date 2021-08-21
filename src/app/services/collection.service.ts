import 'chromedriver';
import { Builder, By, Key, WebDriver } from 'selenium-webdriver';
import { COLLECTION_URL } from '../constants';
import { AssetsService } from './assets.service';

export class CollectionService {
  constructor(private readonly assetsService: AssetsService) {}

  private driver: WebDriver;

  public async run() {
    this.driver = await this.buildDriver();

    await this.openUrl();
    await this.login();
    await this.collectTranslatedNames();
  }

  private async openUrl(): Promise<void> {
    await this.driver.get(COLLECTION_URL);
  }

  private async login(): Promise<void> {
    const loginDropdown = await this.driver.findElement(By.css("[data-target='#login-modal']"));

    await loginDropdown.click();

    await this.driver.sleep(1000);

    const emailInput = await this.driver.findElement(By.name('auth_key'));

    await emailInput.sendKeys(process.env.EMAIL!);

    const passwordInput = await this.driver.findElement(By.name('password'));

    await passwordInput.sendKeys(process.env.PASSWORD!);

    const submitInput = await this.driver.findElement(By.css(".modal-body input[type='submit']"));

    await submitInput.click();
  }

  private async collectTranslatedNames(): Promise<void> {
    const names = await this.assetsService.loadTranslatedCards();

    for (const name of names) {
      const search = await this.driver.findElement(By.name('query_string'));

      await search.sendKeys(name, Key.ENTER);

      const isCardDetailsPage = await this.checkIsCardDetailsPage();

      if (isCardDetailsPage) {
        await this.addCardToCollection();
      } else {
        await this.driver.wait(() => {
          return this.checkIsCardDetailsPage();
        });

        await this.addCardToCollection();
      }
    }
  }

  private async addCardToCollection(): Promise<void> {
    await this.driver.wait(async () => {
      const addToCollectionButtons = await this.driver.findElements(By.css("[data-target='#modal-collection-add']"));

      return addToCollectionButtons.length > 0;
    });

    const addToCollectionButton = await this.driver.findElement(By.css("[data-target='#modal-collection-add']"));

    await addToCollectionButton.click();

    await this.driver.sleep(1000);

    const addButton = await this.driver.findElement(By.css("div.modal-content input[value='Add']"));

    await addButton.click();

    await this.driver.wait(async () => {
      const successContainerElement = await this.driver.findElements(By.css('.alert-success'));

      return successContainerElement.length > 0;
    });
  }

  private async checkIsCardDetailsPage(): Promise<boolean> {
    const priceContainer = await this.driver.findElements(By.css('div.price-box-container'));

    return priceContainer.length > 0;
  }

  private buildDriver(): Promise<WebDriver> {
    return new Builder().forBrowser('chrome').build();
  }
}
