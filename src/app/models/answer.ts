export interface Answer {
  readonly _id: string;
  readonly status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED';
}
