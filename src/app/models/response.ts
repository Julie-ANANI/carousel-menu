import { Answer } from './answer';

export interface Response {
  result?: Array<any>;
  _metadata?: any;

  answers?: {
    localAnswers?: Array<Answer>;
    draftAnswers?: Array<Answer>;
  }

  [property: string]: any;
}
