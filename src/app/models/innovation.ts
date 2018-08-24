import { InnovationSettings } from './innov-settings';
import { InnovCard } from './innov-card';
import { QuestionReport } from './market-report';
import { Media } from './media';
// import { Preset } from './preset';
import { Tag } from './tag';
import { User } from './user.model';

export interface Innovation {
  __v?: number;
  readonly _id?: string;
  owner?: User;
  readonly campaigns?: Array<any>;
  status?: 'EDITING' | 'SUBMITTED' | 'EVALUATING' | 'DONE';
  statusLogs?: Array<{
    action: 'SUBMIT' | 'REJECT' | 'VALIDATE' | 'FINISH'
    user: User,
    date: Date
  }>
  readonly name?: string;
  domain?: string;
  type?: 'insights' | 'apps' | 'leads';
  readonly principalMedia?: Media;
  innovationCards?: Array<InnovCard>;
  tags?: Array<Tag>;
  preset?: any; // This isn't preset anymore -> we don't have ObjectID.
  readonly quizId?: string;
  comments?: string;
  marketReport?: {[prop: string]: QuestionReport};
  collaborators?: Array<User>;
  settings?: InnovationSettings;
  stats?: any;
  restitution?: boolean;
  clientSatisfaction?: {satisfaction?: 'VERY_HAPPY' | 'HAPPY' | 'NORMAL' | 'BAD' | 'VERY_BAD', message?: string};
  feedback?: string;
  thanks?: boolean;
  readonly projectStatus?: number;
  readonly reviewing?: any;
  readonly patented?: boolean;
  isPublic?: boolean;
  external_diffusion?: boolean;
  readonly launched?: Date;
  readonly created?: Date;
  readonly updated?: Date;
  operator?: User;
  previewMode?: boolean;
  completion?: number;
  _metadata?: any;
}
