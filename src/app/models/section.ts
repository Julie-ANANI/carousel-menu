import { Question } from './question';

export interface Section {
  _id?: string;
  readonly name: string;
  readonly questions: Array<Question>;
}
