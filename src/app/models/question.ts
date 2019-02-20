import { Multiling } from './multiling';

export interface Option {
  identifier: string;
  readonly label: Multiling;
  readonly color?: string;
  readonly positive?: boolean;
}

export type QuestionType = 'checkbox' | 'clearbit' | 'list' | 'radio' | 'scale' | 'stars' | 'textarea' | 'toggle';

export interface Question {
  readonly _id?: string;
  identifier: string;
  readonly label: Multiling;
  readonly title: Multiling;
  readonly subtitle: Multiling;
  readonly controlType: QuestionType;
  readonly canComment: boolean;
  readonly parameters?: {
    type: 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'tel' | 'text' | 'time' | 'url' | 'week';
    addon: string;
    min: number;
    max: number;
    step: number;
  };
  options?: Array<Option>;
}
