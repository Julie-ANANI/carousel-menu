import { Campaign } from './campaign';
import { Tag } from './tag';

export interface Professional {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly jobTitle: string;
  readonly company: string;
  readonly email: string;
  readonly tags: Array<Tag>;
  readonly profileUrl: string;
  readonly country: string;
  readonly campaigns: Campaign[];
}
