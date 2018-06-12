import {Types} from './types';

export interface Table {
  readonly _title?: string;
  readonly _isSelectable?: boolean;
  readonly _isEditable?: boolean;
  readonly _content: any[];
  readonly _total?: number;
  readonly _columns: string[];
  readonly _columnsNames?: string[];
  readonly _types: Types[];
}
