import { User } from './user.model';

export interface Showcase {
  readonly _id?: string;
  readonly name: string;
  readonly owner?: User;
}
