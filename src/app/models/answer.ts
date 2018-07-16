import { Clearbit } from './clearbit';
import { Professional } from './professional';
import { Tag } from './tag';

export interface Answer {
  readonly _id: string;
  status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED_NO_MAIL' | 'VALIDATED';
  quizReference: string;
  originalAnswerReference: string;
  tags: Array<Tag>;
  answerTags: {[qestionID: string]: Array<Tag>}
  profileQuality: number;
  country: {flag: string, domain: string, name: string};
  job: string;
  readonly ip: any;
  company: Clearbit;
  readonly professional: Professional;
  readonly answers: any;
  readonly created: Date;
}
