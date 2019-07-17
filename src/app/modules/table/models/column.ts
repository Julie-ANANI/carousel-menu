import { Choice } from './choice';
import { MultiLabel } from './multi-label';

export interface Column {
  _isSelected?: boolean;
  _isSearchable?: boolean;
  _isHidden?: boolean,
  readonly _attrs: string[];
  readonly _type: types;
  readonly _name?: string;
  readonly _isSortable?: boolean;
  readonly _choices?: Choice[];
  readonly _multiLabels?: MultiLabel[];
  readonly _width?: string;
  readonly _enableTooltip?: boolean;
  readonly _imgHeight?: string;
}

export type types = 'TEXT' | 'COUNTRY' | 'PICTURE' | 'PROGRESS' | 'CHECK' | 'MULTI-CHOICES' | 'MULTI-IMAGE-CHOICES' | 'DATE' | 'ARRAY' | 'MULTI-LABEL' | 'MULTILING' | 'TAG-LIST' | 'COUNTRY-NAME' | 'LENGTH';
