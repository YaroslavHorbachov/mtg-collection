import { readFile, writeFile } from 'fs/promises';

export class AssetsService {
  public async loadRawCardsNames(): Promise<string[]> {
    const rawBuffer = await readFile('src/assets/raw_cards.json');
    const parsedFile = JSON.parse(rawBuffer.toString('utf-8'));

    return (parsedFile as string[]).reverse();
  }

  public loadTranslatedCards(): Promise<string[]> {
    return this.loadCards('translated_cards');
  }

  public async saveTranslatedCards(cards: string[]): Promise<void> {
    await this.saveCards('translated_cards', cards);
  }

  public async saveUntranslatedCards(cards: string[]): Promise<void> {
    await this.saveCards('untranslated_cards', cards);
  }

  private async saveCards(fileName: string, cards: string[]): Promise<void> {
    const path = this.convertToAssetsPath(fileName);

    await writeFile(path, JSON.stringify(cards));
  }

  private async loadCards(fileName: string) {
    const path = this.convertToAssetsPath(fileName);
    const rawBuffer = await readFile(path);
    const parsedFile = JSON.parse(rawBuffer.toString('utf-8'));

    return parsedFile;
  }

  private convertToAssetsPath(fileName: string): string {
    return `src/assets/${fileName}.json`;
  }
}
