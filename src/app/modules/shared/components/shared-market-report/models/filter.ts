import { Multiling } from '../../../../../models/multiling';

export interface Filter {
  readonly status: 'TAG' | 'CHECKBOX' | 'CLEARBIT' | 'COUNTRIES' | 'LIST' | 'RADIO';
  readonly questionId?: string;
  readonly questionTitle: Multiling;
  readonly value?: any;
}
