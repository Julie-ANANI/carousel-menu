import { Choice } from './choice';
import { MultiLabel } from './multi-label';

export interface Column {
  _isSelected?: boolean;
  _isFiltrable?: boolean;
  readonly _attrs: string[];
  readonly _type: types;
  readonly _name?: string;
  readonly _isSortable?: boolean;
  readonly _choices?: Choice[];
  readonly _multiLabels?: MultiLabel[];
  readonly _maxWidth?: string;
  readonly _minWidth?: string;
  readonly _enableTooltip?: boolean;
  readonly _imgHeight?: string;
}

export type types = 'TEXT' | 'COUNTRY' | 'PICTURE' | 'PROGRESS' | 'CHECK' | 'MULTI-CHOICES' | 'DATE' | 'ARRAY' | 'MULTI-LABEL' | 'MULTILING'
                    | 'TAG-LIST' | 'COUNTRY-NAME';
