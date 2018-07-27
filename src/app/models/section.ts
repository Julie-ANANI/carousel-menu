import { Question } from './question';
import {Multiling} from './multiling';

export interface Section {
  _id?: string;
  readonly name: string;
  readonly label: Multiling;
  readonly questions: Array<Question>;
}
