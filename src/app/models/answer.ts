import { Clearbit } from './clearbit';
import { Professional } from './professional';
import { Tag } from './tag';

export interface Answer {
  readonly _id?: string;
  readonly campaign: string;
  readonly innovation: string;
  status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED_NO_MAIL' | 'VALIDATED' | 'REJECTED_GMAIL';
  quizReference?: string;
  originalAnswerReference?: string;
  tags: Array<Tag>;
  answerTags: {[qestionID: string]: Array<Tag>}
  profileQuality?: number;
  time_elapsed?: number;
  country: {flag: string, domain?: string, name?: string};
  job: string;
  company: Clearbit;
  readonly ip?: any;
  readonly answeredByEmail: boolean;
  readonly blacklistedCompany?: boolean;
  readonly professional?: Professional;
  readonly answers: any;
  readonly created?: Date;
  readonly updated?: Date;
  isLoading?: boolean;
}
