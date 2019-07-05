import { Answer } from './answer';
import { Clearbit } from './clearbit';
import { Innovation } from './innovation';
import { Tag } from './tag';
import { User } from './user.model';

export interface Showcase {
  readonly _id?: string;
  readonly name: string;
  readonly tags: Array<Tag>;
  readonly answers: Array<Answer>;
  readonly clients: Array<Clearbit>;
  readonly projects: Array<Innovation>;
  readonly owner?: User;
}
