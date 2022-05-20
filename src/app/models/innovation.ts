import { InnovationSettings } from './innov-settings';
import { InnovCard } from './innov-card';
import { QuestionReport } from './market-report';
import { Tag } from './tag';
import { User } from './user.model';
import { Mission } from './mission';
import { ClientProject } from './client-project';
import { Question } from './question';
import {Community} from './community';
import {Consent} from './consent';
import {NotificationTrigger} from './notification';
import {Campaign} from './campaign';
import {UmiusMediaInterface} from '@umius/umi-common-component';

export type InnovationStatus = 'EDITING' | 'SUBMITTED' | 'EVALUATING' | 'DONE';
export type InnovationStatusLogsType = 'SUBMIT' | 'REJECT' | 'VALIDATE' | 'FINISH';
export type InnovationClientSatisfactionType = 'VERY_HAPPY' | 'HAPPY' | 'NORMAL' | 'BAD' | 'VERY_BAD';
export type InnovationFollowUpTemplateType = 'DISCUSSION' | 'INFORM' | 'INTERVIEW' | 'OPENING' | 'NOFOLLOW';

export interface InnovationFollowUpEmailsCc {
  firstName: string;
  lastName: string;
  email: string;
}

export interface InnovationFollowUpEmailsTemplateEntry {
  lang: string;
  subject: string;
  content: string;
}

export interface InnovationFollowUpEmailsTemplate {
  name: InnovationFollowUpTemplateType;
  entry: Array<InnovationFollowUpEmailsTemplateEntry>;
}

// TODO remove multiling
export interface InnovationFollowUpEmails {
  /**
   * for the old follow up at the admin side.
   */
  ccEmail?: string;

  /**
   * use this with the new implementation.
   */
  cc?: Array<InnovationFollowUpEmailsCc>;

  /**
   * to show or hide the Follow-Up module at the client side
   */
  status?: 'ACTIVE' | 'INACTIVE';

  /**
   * company name
   */
  entity?: string;

  /**
   * TODO send this format from back.
   */
  templates?: Array<InnovationFollowUpEmailsTemplate>;

  /**
   * TODO remove these pattern
   */
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
   * we keep the track of the notification that has been sent for the innovation
   * because based on that we can show or hide the notification button at the
   * admin side. We only save the trigger name.
   */
  notifications: [NotificationTrigger];

  /**
   * innovation data push to the community api.
   */
  community?: Community;

  /**
   * published date of the innovation to the community.
   */
  published?: Date | null;

  readonly _id?: string;
  readonly campaigns?: Array<Campaign>;
  readonly principalMedia?: UmiusMediaInterface;
  readonly quizId?: string;
  stats?: InnovationStats;
  readonly reviewing?: any;
  readonly launched?: Date;
  readonly created?: Date;
  readonly updated?: Date;

  readonly similar?: Array<{
    matched_inno_id: string;
    score: number;
  }>;

  _metadata?: any;
  owner?: User;
  status?: InnovationStatus;

  statusLogs?: Array<{
    action: InnovationStatusLogsType;
    user: User;
    date: Date;
  }>;

  name?: string;
  domain?: string;
  questionnaireComment?: string;
  innovationCards?: Array<InnovCard>;
  tags?: Array<Tag>;
  preset?: any; // This isn't preset anymore -> we don't have ObjectID.

  marketReport?: {
    [questionIdentifier: string]: QuestionReport
  };

  collaborators?: Array<User>;
  collaboratorsConsent?: Consent;
  settings?: InnovationSettings;
  updatedStats?: Date;
  restitution?: boolean;
  proofreading?: boolean;

  clientSatisfaction?: {
    satisfaction?: InnovationClientSatisfactionType;
    message?: string;
  };

  feedback?: string;
  thanks?: boolean;
  isPublic?: boolean;
  external_diffusion?: boolean;
  ownerConsent?: Consent;
  clientProject?: ClientProject | string;
  mission?: Mission | string;
  operator?: User;
  previewMode?: boolean;
  followUpEmails?: InnovationFollowUpEmails;

  /**
   * not use anymore. It's for the innovations old executive report.
   */
  executiveReport?: OldExecutiveReport;

  /**
   * store the id of the Executive Report
   */
  executiveReportId?: string;

  /**
   * TODO discuss this. not use anymore
   */
  percentages?: InnovationMetadataValues;
}
