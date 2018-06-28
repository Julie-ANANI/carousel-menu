import {Label} from './label';

export interface Column {
  _isSelected?: boolean;
  _isHover?: boolean;
  readonly _attr: string[];
  readonly _type: types;
  readonly _name?: string;
  readonly _choices?: Label[];
}

export type types = 'TEXT' | 'COUNTRY' | 'PICTURE' | 'PROGRESS' | 'CHECK' | 'LABEL' | 'DATE' | 'ARRAY';
