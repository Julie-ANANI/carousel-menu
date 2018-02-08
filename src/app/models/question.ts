export interface Question {
  _id: string;
  readonly identifier: string;
  readonly controlType: 'checkbox' | 'clearbit' | 'list' | 'radio' | 'scale' | 'stars' | 'textarea' | 'textbox' | 'toggle';
  readonly options?: Array<any>;
}
