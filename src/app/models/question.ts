export interface Question {
  _id: string;
  readonly label: {fr: string, en: string};
  readonly identifier: string;
  readonly controlType: 'checkbox' | 'clearbit' | 'list' | 'radio' | 'scale' | 'stars' | 'textarea' | 'textbox' | 'toggle';
  options?: Array<any>;
}
