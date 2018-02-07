import { InnovationSettings } from './innov-settings';
import { InnovCard } from './innov-card';
import { Media } from './media';
import { User } from './user.model';

export interface Innovation {
  readonly _id: string;
  readonly status: 'EDITING' | 'SUBMITTED' | 'EVALUATING' | 'DONE';
  readonly name: string;
  readonly type: 'insights' | 'apps' | 'leads';
  readonly principalMedia: Media;
  readonly innovationCards: Array<InnovCard>;
  collaborators: Array<User>;
  readonly settings: InnovationSettings;
  stats: any;
  restitution: boolean;
  thanks: boolean;
  readonly launched: Date;
}
