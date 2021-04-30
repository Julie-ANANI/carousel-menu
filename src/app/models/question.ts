import { Multiling } from './multiling';

export interface Option {
  identifier: string;
  label: Multiling;
  color?: string;
  positive?: boolean;
}

export type QuestionType = 'checkbox' | 'clearbit' | 'list' | 'radio' | 'scale' | 'stars' | 'textarea' | 'toggle';

export interface Question {
  _id?: string;
  identifier: string;
  controlType: QuestionType;
  label: Multiling;
  title: Multiling;
  subtitle: Multiling;
  canComment: boolean;
  sensitiveAnswerData: boolean;
  parameters?: {
    type: 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'tel' | 'text' | 'time' | 'url' | 'week';
    addon: string;
    min: number;
    max: number;
    step: number;
  };
  options?: Array<Option>;
  positivesAnswersLabel?: Multiling;
  visibility?: boolean;
  toggle?: boolean; // using this in only front-side, to toggle the question.

  /**
   *  it's a text used in the quiz front for help or an instruction based on the questionType.
   */
  instruction?: Multiling;

  /**
   * maximum options he can select for controlType === 'checkbox'
   */
  maxOptionsSelect?: number;

}
