import { Choice } from './choice';
import { MultiLabel } from './multi-label';

export interface Column {
  _isSelected?: boolean;
  _isSearchable?: boolean;
  _isHidden?: boolean;
  readonly _attrs: string[];
  readonly _type: types;
  readonly _name?: string;
  readonly _isSortable?: boolean;
  readonly _choices?: Choice[];
  readonly _disabledState?: {_attrs: string, _type: types};
  readonly _multiLabels?: MultiLabel[];
  readonly _width?: string;
  readonly _maxWidth?: string;
  readonly _enableTooltip?: boolean;
}

export type types = 'TEXT' | 'COUNTRY' | 'PICTURE' | 'PROGRESS' | 'CHECK' | 'MULTI-CHOICES' | 'MULTI-IMAGE-CHOICES' | 'DATE' | 'ARRAY' | 'MULTI-LABEL' | 'MULTILING' | 'TAG-LIST' | 'COUNTRY-NAME' | 'LENGTH' | 'DAYS-TO' | 'DROPDOWN';
