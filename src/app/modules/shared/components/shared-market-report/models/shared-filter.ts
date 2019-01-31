import { User } from '../../../../../models/user.model';

export interface SharedFilter {
  readonly name: string;
  readonly owner: User;
  readonly answers: Array<string>;
}
