export interface Language {
  type?: string;
  alias?: string;
  status?: string;
}

export const lang: Array<Language> = [
  { type: 'en', alias: 'English', status: 'EDITING' },
  { type: 'fr', alias: 'French', status: 'DONE' },
  { type: 'zh', alias: 'Chinese', status: 'WAITING' },
];
