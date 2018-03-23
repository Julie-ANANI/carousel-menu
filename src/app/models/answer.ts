import { Professional } from './professional';

export interface Answer {
  readonly _id: string;
  readonly status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED';
  quizReference: string;
  originalAnswerReference: string;
  tags: Array<string>;
  profileQuality: number;
  country: {flag: string, domain: string, name: string};
  readonly professional: Professional;
  readonly answers: any;
}
