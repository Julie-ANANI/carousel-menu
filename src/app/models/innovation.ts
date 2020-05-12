import { InnovationSettings } from './innov-settings';
import { InnovCard } from './innov-card';
import { QuestionReport } from './market-report';
import { Media } from './media';
// import { Preset } from './preset';
import { Tag } from './tag';
import { User } from './user.model';
import { Mission } from './mission';
import { ClientProject } from './client-project';

export interface InnovationMetadataValues {
  preparation?: number;
  campaign?: number;
  delivery?: number;
}

export interface Innovation {

  readonly _id?: string;
  owner?: User;
  readonly campaigns?: Array<any>;

  status?: 'EDITING' | 'SUBMITTED' | 'EVALUATING' | 'DONE';

  statusLogs?: Array<{
    action: 'SUBMIT' | 'REJECT' | 'VALIDATE' | 'FINISH'
    user: User,
    date: Date
  }>;

  name?: string;
  domain?: string;
  readonly principalMedia?: Media;
  innovationCards?: Array<InnovCard>;
  tags?: Array<Tag>;
  preset?: any; // This isn't preset anymore -> we don't have ObjectID.
  readonly quizId?: string;

  marketReport?: {
    [questionIdentifier: string]: QuestionReport
  };

  collaborators?: Array<User>;
  settings?: InnovationSettings;
  stats?: any;
  restitution?: boolean;

  clientSatisfaction?: {
    satisfaction?: 'VERY_HAPPY' | 'HAPPY' | 'NORMAL' | 'BAD' | 'VERY_BAD',
    message?: string
  };

  feedback?: string;
  thanks?: boolean;
  readonly reviewing?: any;
  isPublic?: boolean;
  external_diffusion?: boolean;
  readonly launched?: Date;
  readonly created?: Date;
  readonly updated?: Date;

  ownerConsent?: {
    value?: boolean,
    date?: any
  };

  // not use anymore. It's for the old innovations.
  executiveReport?: {
    totalSections?: number,
    goal?: string,
    professionalAbstract?: string,
    sections?: Array<{quesId: string}>,
    abstracts?: [{
      quesId: string,
      value: string
    }]
  };

  executiveReportId?: string;
  clientProject?: ClientProject | string;
  mission?: Mission | string;

  operator?: User;
  previewMode?: boolean;
  completion?: number;

  readonly similar?: Array<{
    matched_inno_id: string,
    score: number
  }>;

  percentages?: InnovationMetadataValues;

  _metadata?: any;

  followUpEmails?: {

    ccEmail?: string,

    interview?: {
      fr: {
        subject: string,
        content: string
      },
      en: {
        subject: string,
        content: string
      }
    },

    opening?: {
      fr: {
        subject: string,
        content: string
      },
      en: {
        subject: string,
        content: string
      }
    },

    noFollow?: {
      fr: {
        subject: string,
        content: string
      },
      en: {
        subject: string,
        content: string
      }
    }

  }

}
