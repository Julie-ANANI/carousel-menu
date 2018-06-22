import { InnovationSettings } from './innov-settings';
import { InnovCard } from './innov-card';
import { QuestionReport } from './market-report';
import { Media } from './media';
import { Preset } from './preset';
import { User } from './user.model';

export interface Innovation {
  readonly _id?: string;
  readonly owner?: User;
  readonly campaigns?: Array<any>;
  status?: 'EDITING' | 'SUBMITTED' | 'EVALUATING' | 'DONE';
  readonly name?: string;
  readonly domain?: string;
  readonly type?: 'insights' | 'apps' | 'leads';
  readonly principalMedia?: Media;
  innovationCards?: Array<InnovCard>;
  tags?: Array<any>;
  preset?: Preset;
  readonly quizId?: string;
  marketReport?: {[prop: string]: QuestionReport};
  collaborators?: Array<User>;
  settings?: InnovationSettings;
  stats?: any;
  restitution?: boolean;
  thanks?: boolean;
  readonly projectStatus?: number;
  readonly reviewing?: any;
  readonly patented?: boolean;
  readonly external_diffusion?: boolean;
  readonly launched?: Date;
  readonly created?: Date;
  readonly updated?: Date;
}
