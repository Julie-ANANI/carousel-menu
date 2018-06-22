import {Column} from './column';

export interface Table {
  readonly _selector: string;
  readonly _title?: string;
  readonly _isSelectable?: boolean;
  readonly _isEditable?: boolean;
  readonly _isDeletable?: boolean;
  readonly _isFiltrable?: boolean;
  readonly _isSortable?: boolean;
  readonly _isNotPaginable?: boolean;
  readonly _content: any[];
  readonly _total: number;
  readonly _columns: Column[];
  readonly _actions?: string[];
}
