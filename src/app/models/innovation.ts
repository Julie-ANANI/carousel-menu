import { InnovationSettings } from './innov-settings';
import { InnovCard } from './innov-card';
import { QuestionReport } from './market-report';
import { Media } from './media';
import { Tag } from './tag';
import { User } from './user.model';
import { Mission } from './mission';
import { ClientProject } from './client-project';
import { Question } from './question';
import {Community} from './community';
import {Consent} from './consent';

export interface InnovationFollowUpEmailsCc {
  firstName: string;
  lastName: string;
  email: string;
}

export interface InnovationFollowUpEmails {
  ccEmail?: string;
  cc?: Array<InnovationFollowUpEmailsCc>;

  /**
   * to show or hide the Follow Up module at the client side
   */
  status?: 'ACTIVE' | 'INACTIVE';

  /**
   * company name
   */
  entity?: string;

  discussion?: {
    fr: {
      subject: string;
      content: string;
    },
    en: {
      subject: string;
      content: string;
    }
  };

  inform?: {
    fr: {
      subject: string;
      content: string;
    },
    en: {
      subject: string;
      content: string;
    }
  };

  interview?: {
    fr: {
      subject: string;
      content: string;
    },
    en: {
      subject: string;
      content: string;
    }
  };

  opening?: {
    fr: {
      subject: string;
      content: string;
    },
    en: {
      subject: string;
      content: string;
    }
  };

  noFollow?: {
    fr: {
      subject: string;
      content: string;
    },
    en: {
      subject: string;
      content: string;
    }
  };
}

/**
 * when creating the new project.
 */
export interface NewInnovation {
  name: string;
  lang: string; // project language
  domain: string;
  reportingLang: string; // market test result lang
  collaborators?: Array<string>;
  collaboratorsConsent?: Consent;
}

export interface InnovationMetadataValues {
  preparation?: number;
  campaign?: number;
  delivery?: number;
}

export type InnovationStatus = 'EDITING' | 'SUBMITTED' | 'EVALUATING' | 'DONE';

// not use anymore. It's for the innovations old executive report.
export interface OldExecutiveReport {
  totalSections: number;
  goal?: string;
  professionalAbstract: string;
  sections: Array<{quesId: string}>;
  conclusion: string;
  questions: Array<Question>;
  lang: 'en' | 'fr';
  operator: User;
  abstracts: [{
    quesId: string,
    value: string
  }];
}

export interface InnovationStats {
  [p: string]: number;
  pros?: number;
  emailsOK?: number;
  received?: number;
  opened?: number;
  clicked?: number;
  validatedAnswers?: number;
  toValidateAnswers?: number;
  answers?: number;
  nbFirstMail?: number;
  nbSecondMail?: number;
  nbThirdMail?: number;
  googleRequests?: number;
}

export interface Innovation {

  /**
   * innovation data push to the community api.
   */
  community?: Community;

  /**
   * published date of the innovation to the community.
   */
  published?: Date | null;

  readonly _id?: string;
  owner?: User;
  readonly campaigns?: Array<any>;

  status?: InnovationStatus;

  statusLogs?: Array<{
    action: 'SUBMIT' | 'REJECT' | 'VALIDATE' | 'FINISH'
    user: User,
    date: Date
  }>;

  name?: string;
  domain?: string;
  questionnaireComment?: string;
  readonly principalMedia?: Media;
  innovationCards?: Array<InnovCard>;
  tags?: Array<Tag>;
  preset?: any; // This isn't preset anymore -> we don't have ObjectID.
  readonly quizId?: string;

  marketReport?: {
    [questionIdentifier: string]: QuestionReport
  };

  collaborators?: Array<User>;
  collaboratorsConsent?: Consent;

  settings?: InnovationSettings;
  readonly stats?: InnovationStats;
  updatedStats?: Date;
  restitution?: boolean;
  proofreading?: boolean;

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

  ownerConsent?: Consent;

  // not use anymore. It's for the innovations old executive report.
  executiveReport?: OldExecutiveReport;

  executiveReportId?: string;
  clientProject?: ClientProject | string;
  mission?: Mission | string;

  operator?: User;
  previewMode?: boolean;

  readonly similar?: Array<{
    matched_inno_id: string,
    score: number
  }>;

  percentages?: InnovationMetadataValues;

  _metadata?: any;

  followUpEmails?: InnovationFollowUpEmails;

}
