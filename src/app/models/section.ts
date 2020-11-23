import { Question } from './question';
import { Multiling } from './multiling';

// todo remove
export interface Section {
  readonly label: Multiling;
  description: 'nothing' | '1st' | '2nd';
  readonly questions: Array<Question>;
}
