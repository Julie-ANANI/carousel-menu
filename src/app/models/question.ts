import {UmiusMultilingInterface} from '@umius/umi-common-component';

/**
 * Not use anymore. Only there to work with the old presets.
 */

export type QuestionType = 'checkbox' | 'clearbit' | 'list' | 'radio' | 'scale' | 'stars' | 'textarea' | 'toggle'
  | 'ranking'| 'likert-scale';

export type QuestionParametersType = 'color' | 'date' | 'datetime-local' | 'email' | 'month'
  | 'number' | 'password' | 'tel' | 'text' | 'time' | 'url' | 'week';

export interface QuestionOptionEntry {
  lang: string;
  label: string;
}

export interface QuestionEntry {
  label: string;
  lang: string;
  title: string;
  subtitle: string;
  positivesAnswersLabel: string;
  instruction: string;
}

export interface Option {
  identifier: string;
  color?: string;
  positive?: boolean;
  entry?: Array<QuestionOptionEntry>

  /**
   * TODO remove this
   */
  label: UmiusMultilingInterface;
}

// TODO remove multiling
export interface Question {
  _id?: string;
  identifier: string;
  controlType: QuestionType;
  canComment: boolean;
  randomization?: boolean;
  sensitiveAnswerData: boolean;
  options?: Array<Option>;
  visibility?: boolean;
  entry?: Array<QuestionEntry>;

  parameters?: {
    type: QuestionParametersType;
    addon: string;
    min: number;
    max: number;
    step: number;
  };


  /**
   * using this in only front-side, to toggle the question.
   */
  toggle?: boolean;

  /**
   * maximum options he can select for controlType === 'checkbox'
   */
  maxOptionsSelect?: number;

  // TODO remove this
  label: UmiusMultilingInterface;
  title: UmiusMultilingInterface;
  subtitle: UmiusMultilingInterface;
  positivesAnswersLabel?: UmiusMultilingInterface;

  /**
   *  it's a text used in the quiz front for help or an instruction based on the questionType.
   */
  instruction?: UmiusMultilingInterface;
}
