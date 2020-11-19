import { User } from '../../../../../models/user.model';

export interface SharedFilter {
  readonly _id?: string;
  name: string;
  readonly owner: User;
  readonly answers: Array<string>;
}
