 import { Column } from './column';

export interface Table {
  readonly _selector?: string;
  readonly _title?: string;
  readonly _isHeadable?: boolean;
  readonly _isSelectable?: boolean;
  readonly _isEditable?: boolean;
  readonly _isNoTitle?: boolean;
  readonly _isTitle?: boolean;
  readonly _isShowable?: boolean;
  readonly _isDeletable?: boolean;
  readonly _isFiltrable?: boolean;
  readonly _isLocal ?: boolean;
  readonly _isNotPaginable?: boolean;
  readonly _reloadColumns?: boolean;
  readonly _columns: Column[];
  readonly _actions?: string[];
  readonly _editIndex?: number;
  readonly _editButtonLabel?: string;
  readonly _buttons?: Array<{ _icon?: string, _label?: string }>;
  _content: any[];
  _total: number;
}
