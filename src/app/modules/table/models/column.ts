import {Choice} from './choice';
import {MultiLabel} from './multi-label';

export interface Column {
  _isSelected?: boolean;
  _isSearchable?: boolean;
  _isHidden?: boolean;
  _searchTooltip?: string;
  readonly _attrs: string[];
  readonly _type: types;
  readonly _name?: string;
  readonly _isSortable?: boolean;
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
  | 'TAG-LIST'
  | 'COUNTRY-NAME'
  | 'LENGTH'
  | 'DAYS-TO'
  | 'DROPDOWN'
  | 'DATE_TIME'
  | 'NUMBER'
  | 'PATTERNS-OBJECT-LIST'
  | 'GEO-ZONE-LIST'
  | 'LABEL-OBJECT-LIST';
