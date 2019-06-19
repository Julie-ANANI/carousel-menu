 import { Column } from './column';

export interface Table {
  readonly _selector: string;
  readonly _title?: string;
  readonly _isSelectable?: boolean;
  readonly _isEditable?: boolean;
  readonly _isTitle?: boolean;
  readonly _isDeletable?: boolean;
  readonly _isSearchable?: boolean;
  readonly _columns: Column[];
  readonly _actions?: string[]; //Todo remove
  readonly _editIndex?: number;
  readonly _isPaginable?: boolean;
  readonly _editButtonLabel?: string;
  readonly _buttons?: Array<{ _icon?: string, _label: string }>;
  _content: any[];
  _total: number;
}
