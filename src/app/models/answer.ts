import { Clearbit } from './clearbit';
import { Professional } from './professional';
import { Tag } from './tag';

export interface Answer {
  readonly _id: string;
  readonly status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED';
  quizReference: string;
  originalAnswerReference: string;
  tags: Array<Tag>;
  answerTags: {[qestionID: string]: Array<Tag>}
  profileQuality: number;
  country: {flag: string, domain: string, name: string};
  job: string;
  company: Clearbit;
  readonly professional: Professional;
  readonly answers: any;
  readonly created: Date;
}
