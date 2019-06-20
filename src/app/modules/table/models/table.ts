 import { Column } from './column';

export interface Table {
  readonly _selector: string;
  readonly _title?: string;
  readonly _isSelectable?: boolean;
  readonly _isEditable?: boolean;
  readonly _isTitle?: boolean;
  readonly _isDeletable?: boolean;
  readonly _isSearchable?: boolean;
  readonly _columns: Array<Column>;
  readonly _editIndex?: number;
  readonly _isPaginable?: boolean;
  readonly _editButtonLabel?: string;
  readonly _buttons?: Array<{ _icon?: string, _label: string }>;
  readonly _isLocal?: boolean;
  _content: Array<any>;
  _total: number;
}
