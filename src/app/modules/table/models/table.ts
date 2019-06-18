 import { Column } from './column';

export interface Table {
  readonly _selector: string;
  readonly _title?: string;
  readonly _isHeadable?: boolean; //Todo remove
  readonly _isSelectable?: boolean;
  readonly _isEditable?: boolean;
  readonly _isNoTitle?: boolean; //Todo remove
  readonly _isTitle?: boolean;
  readonly _isShowable?: boolean; // todo remove
  readonly _isDeletable?: boolean;
  readonly _isFiltrable?: boolean;
  readonly _isLocal?: boolean; // todo remove
  readonly _isNotPaginable?: boolean; //Todo remove
  readonly _reloadColumns?: boolean; //Todo remove
  readonly _columns: Column[];
  readonly _actions?: string[]; //Todo remove
  readonly _editIndex?: number;
  readonly _isPaginable?: boolean;
  readonly _editButtonLabel?: string;
  readonly _buttons?: Array<{ _icon?: string, _label: string }>;
  _content: any[];
  _total: number;
}
