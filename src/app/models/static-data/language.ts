export interface Language {
  type?: string;
  alias?: string;
  [property: string]: any;
}

export const lang: Array<Language> = [
  { type: 'ar', alias: 'Arabic' },
  { type: 'zh', alias: 'Chinese' },
  { type: 'da', alias: 'Danish' },
  { type: 'nl', alias: 'Dutch' },
  { type: 'en', alias: 'English' },
  { type: 'fr', alias: 'French' },
  { type: 'fi', alias: 'Finnish' },
  { type: 'de', alias: 'German' },
  { type: 'it', alias: 'Italian' },
  { type: 'ja', alias: 'Japanese' },
  { type: 'ko', alias: 'Korean' },
  { type: 'el', alias: 'Greek' },
  { type: 'no', alias: 'Norwegian' },
  { type: 'pl', alias: 'Polish' },
  { type: 'pt', alias: 'Portuguese' },
  { type: 'ru', alias: 'Russian' },
  { type: 'es', alias: 'Spanish' },
  { type: 'sv', alias: 'Swedish' },
  { type: 'tr', alias: 'Turkish' },
  { type: 'uk', alias: 'Ukrainian' },
];
