import { ICardsTranslates, ITranslateApiCardsResponse } from '../interfaces';
import { AssetsService } from './assets.service';
import { TranslateApiService } from './translate-api.service';

export class TranslateService {
  constructor(private readonly translateApiService: TranslateApiService, private readonly assetsService: AssetsService) {}

  public async run(): Promise<void> {
    const rawCardsNames = await this.assetsService.loadRawCardsNames();
    const cardsTranslates = await this.loadCardsNamesTranslates(rawCardsNames);

    await this.saveResults(cardsTranslates);
  }

  private async loadCardsNamesTranslates(rawCardsNames: string[]): Promise<ICardsTranslates> {
    const searchResults = await this.searchByNames(rawCardsNames);
    const translatedCards: string[] = [];
    const untranslatedCards: string[] = [];

    for (let cardIndex = 0; cardIndex < searchResults.length; cardIndex++) {
      const { cards } = searchResults[cardIndex];
      const isNotMatch = cards.length === 0;

      if (isNotMatch) {
        const untranslatedCardName = rawCardsNames[cardIndex];

        untranslatedCards.push(untranslatedCardName);
      } else {
        const translatedCardName = cards[0].name;

        translatedCards.push(translatedCardName);
      }
    }

    return { translatedCards, untranslatedCards };
  }

  private async searchByNames(cardsNames: string[]): Promise<ITranslateApiCardsResponse[]> {
    const responses: ITranslateApiCardsResponse[] = [];
    const total = cardsNames.length;

    for (const cardName of cardsNames) {
      const response = await this.translateApiService.searchByName(cardName);

      console.log(`Item #${cardsNames.indexOf(cardName) + 1}: Total: ${total}`);
      console.log(`Raw #${cardName}: Translated: ${response.cards[0]?.name}`);
      responses.push(response);
    }

    return responses;
  }

  private async saveResults(cardsTranslates: ICardsTranslates): Promise<void> {
    const { translatedCards, untranslatedCards } = cardsTranslates;

    await Promise.all([
      this.assetsService.saveTranslatedCards(translatedCards),
      this.assetsService.saveUntranslatedCards(untranslatedCards),
    ]);
  }
}
