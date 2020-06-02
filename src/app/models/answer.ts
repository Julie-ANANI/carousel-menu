import { Clearbit } from './clearbit';
import { Professional } from './professional';
import { Tag } from './tag';

export type AnswerStatus = 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED' | 'VALIDATED_UMIBOT'
  | 'REJECTED_UMIBOT' | 'REJECTED_GMAIL';

export interface Answer {
  readonly _id?: string;
  readonly campaign: string;
  readonly innovation: string;
  status: AnswerStatus;
  quizReference?: string;
  originalAnswerReference?: string;
  tags: Array<Tag>;
  answerTags: {[qestionID: string]: Array<Tag>};
  profileQuality?: number;
  time_elapsed?: number;
  country: {flag: string, domain?: string, name?: string};
  job: string;
  _isSelected?: boolean;
  company: Clearbit;
  mailType?: string;
  readonly ip?: any;
  readonly answeredByEmail: boolean;
  readonly blacklistedCompany?: boolean;
  readonly professional?: Professional;
  readonly answers: any;
  answers_translations: any;
  readonly used_language: string;
  readonly meta: any;
  readonly created?: Date;
  readonly updated?: Date;
  isLoading?: boolean;
  scoreStatus?: number;
  autoTags?: Array<string>;
  followUp?: {objective?: 'INTERVIEW' | 'OPENING' | 'NO_FOLLOW', date?: Date};
}
