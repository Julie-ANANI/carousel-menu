import { Multiling } from '../../../../../models/multiling';

export interface Filter {
  readonly status: 'COUNTRIES' | 'CHECKBOX' | 'RADIO';
  readonly questionId?: string;
  readonly questionTitle: Multiling;
  readonly value?: any;
}
