import axios from 'axios';
import { TRANSLATE_API_URL } from '../constants';
import { Languages } from '../enums';
import { ITranslateApiCardsResponse } from '../interfaces';

export class TranslateApiService {
  public async searchByName(name: string): Promise<ITranslateApiCardsResponse> {
    try {
      const languageQuery = process.env.LANGUAGE! === Languages.English ?? `language=${process.env.LANGUAGE!}`;
      const cardNameQuery = `name=${encodeURIComponent(name)}`;
      const query = [languageQuery, cardNameQuery].join('&');
      const url = [TRANSLATE_API_URL, query].join('?');
      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      console.error({ error, name });

      return { cards: [] };
    }
  }
}
