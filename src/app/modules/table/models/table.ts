 import { Column } from './column';

export interface Table {
  readonly _selector: string;
  readonly _title?: string;
  readonly _isSelectable?: boolean;
  readonly _isEditable?: boolean;
  readonly _isTitle?: boolean;
  readonly _isAddParent?: boolean;
  readonly _isLegend?: boolean;
  readonly _isDeletable?: boolean;
  readonly _isRowDisabled?: any;
  readonly _isSearchable?: boolean;
  readonly _isBulkEdit?: boolean;
  readonly _columns: Array<Column>;
  readonly _clickIndex?: number;
  readonly _isPaginable?: boolean;
  readonly _editButtonLabel?: string;
  readonly _buttons?: Array<{ _label: string, _icon?: string, _colorClass?: string, _iconSize?: string, _isHidden?: boolean }>;
  readonly _isLocal?: boolean;
  readonly _isNoMinHeight?: boolean;
  readonly _hasCustomFilters?: boolean // pass this value in _isLocal = true, it just emits the config.
  _content: Array<any>;
  _total: number;
}
