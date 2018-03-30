import { Multiling } from './multiling';

export interface Option {
  readonly identifier: string;
  readonly label: Multiling;
  readonly color?: string;
  readonly positive?: boolean;
}

export interface Question {
  _id: string;
  readonly label: Multiling;
  readonly title: Multiling;
  identifier: string;
  readonly controlType: 'checkbox' | 'clearbit' | 'list' | 'radio' | 'scale' | 'stars' | 'textarea' | 'textbox' | 'toggle';
  readonly canComment: boolean;
  options?: Array<Option>;
}
