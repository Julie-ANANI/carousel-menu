import { Multiling } from './multiling';

export interface Option {
  readonly identifier: string;
  readonly label: Multiling;
  readonly color?: string;
  readonly positive?: boolean;
}

export interface Question {
  _id?: string;
  readonly label: Multiling;
  readonly title: Multiling;
  readonly subtitle: Multiling;
  identifier: string;
  controlType: 'checkbox' | 'clearbit' | 'list' | 'radio' | 'scale' | 'stars' | 'textarea' | 'textbox' | 'toggle';
  canComment: boolean;
  readonly parameters?: {
    type: 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'tel' | 'text' | 'time' | 'url' | 'week';
    addon: string;
    min: number;
    max: number;
    step: number;
  }
  options?: Array<Option>;
}
