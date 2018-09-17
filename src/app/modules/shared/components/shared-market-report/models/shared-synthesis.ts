import { User } from '../../../../../models/user.model';

export interface SharedSynthesis {
  readonly name: string;
  readonly owner: User;
  readonly answers: Array<string>;
}
