import { Question } from './question';
import { Multiling } from './multiling';

export interface Section {
  readonly label: Multiling;
  readonly description: 'nothing' | '1st' | '2nd';
  readonly questions: Array<Question>;
}
