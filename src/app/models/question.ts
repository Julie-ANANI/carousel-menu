import { Multiling } from './multiling';

export interface Question {
  _id: string;
  readonly label: Multiling;
  readonly title: Multiling;
  identifier: string;
  readonly controlType: 'checkbox' | 'clearbit' | 'list' | 'radio' | 'scale' | 'stars' | 'textarea' | 'textbox' | 'toggle';
  readonly canComment: boolean;
  options?: Array<any>;
}
