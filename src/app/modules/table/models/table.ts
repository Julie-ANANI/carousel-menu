 import {Column} from './column';

export interface Table {
  readonly _selector?: string;
  readonly _title?: string;
  readonly _isHeadable?: boolean;
  readonly _isSelectable?: boolean;
  readonly _isEditable?: boolean;
  readonly _isNoTitle?: boolean;
  readonly _isShowable?: boolean;
  readonly _isDeletable?: boolean;
  readonly _isFiltrable?: boolean;
  readonly _isLocal ?: boolean;
  readonly _isNotPaginable?: boolean;
  readonly _reloadColumns?: boolean;
  readonly _columns: Column[];
  readonly _actions?: string[];
  readonly _editIndex?: number;
  _content: any[];
  _total: number;
}
