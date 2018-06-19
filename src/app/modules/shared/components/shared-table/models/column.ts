import {Label} from './label';

export interface Column {
  readonly _attr: string;
  readonly _type: string;
  readonly _name?: string;
  readonly _choices?: Label[];
}
