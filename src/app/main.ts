import { AssetsService, CollectionService, TranslateApiService, TranslateService } from './services';

async function main(): Promise<void> {
  const translateApiService = new TranslateApiService();
  const assetsService = new AssetsService();
  const translateService = new TranslateService(translateApiService, assetsService);
  const collectionService = new CollectionService(assetsService);

  // await translateService.run();
  await collectionService.run();
}

main();
