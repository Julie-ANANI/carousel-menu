export interface Filter {
  readonly status: 'TAG' | 'CHECKBOX' | 'CLEARBIT' | 'COUNTRIES' | 'CUSTOM' | 'LIST' | 'PROFESSIONALS' | 'RADIO'| 'LIKERT-SCALE';
  readonly questionId: string;
  readonly value?: any;
}
