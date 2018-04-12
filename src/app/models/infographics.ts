import { Question } from './question';

export interface Infographics {
  readonly _id: string;
  readonly questions: Array<Question>;
}
