import { Choice } from './choice';
import { MultiLabel } from './multi-label';

export interface Column {
  _isSelected?: boolean;
  _isSearchable?: boolean;
  _isHidden?: boolean;
  _searchTooltip?: string;
  _isReplaceable?: boolean;
  _isFilled?: boolean;
  _isOldValue?: boolean;
  _color?: string;
  _isEditable?: boolean;
  readonly _attrs: string[];
  readonly _type: types;
  readonly _editType?: types;
  readonly _name?: string;
  readonly _isSortable?: boolean;
  readonly _tooltip?: string;
  readonly _choices?: Choice[];
  readonly _disabledState?: { _attrs: string, _type: types };
  readonly _multiLabels?: MultiLabel[];
  readonly _width?: string;
  readonly _enableTooltip?: boolean;
  readonly _isCustomFilter?: boolean; // when pass emits the value of it to the parent component.
  /**
   * This is the expected configuration when we want to search using a collection other than the one which is active
   */
  readonly _searchConfig?: {
    _collection: string,
    _searchKey: string
  };

  readonly _multiInput?: MultiInput;
}

export interface MultiInput {
  sourceList: Array<any>;
  property?: Array<string>;
}

export type types =
  'TEXT'
  | 'COUNTRY'
  | 'PICTURE'
  | 'PROGRESS'
  | 'CHECK'
  | 'MULTI-CHOICES'
  | 'MULTI-IMAGE-CHOICES'
  | 'DATE'
  | 'ARRAY'
  | 'MULTI-LABEL'
  | 'MULTILING'
  | 'MULTI-INPUT'
  | 'TAG-LIST'
  | 'COUNTRY-NAME'
  | 'LENGTH'
  | 'DAYS-TO'
  | 'DROPDOWN'
  | 'DATE_TIME'
  | 'NUMBER'
  | 'USER-INPUT'
  | 'TAG'
  | 'PATTERNS-OBJECT-LIST'
  | 'NAME-LABEL-LIST'
  | 'PRO-TARGET'
  | 'LABEL-OBJECT-LIST';
