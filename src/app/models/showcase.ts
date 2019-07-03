import { Tag } from './tag';
import { User } from './user.model';

export interface Showcase {
  readonly _id?: string;
  readonly name: string;
  readonly tags: Array<Tag>;
  readonly owner?: User;
}
