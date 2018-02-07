import { Question } from './question';

export interface Section {
  readonly _id: string;
  readonly questions: Array<Question>;
}
