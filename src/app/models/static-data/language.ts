export interface Language {
  type?: string;
  alias?: string;
}

export const lang: Array<Language> = [
  { type: 'en', alias: 'English' },
  { type: 'fr', alias: 'French' },
];
