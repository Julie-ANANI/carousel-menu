import {Types} from './types';

export interface Table {
  readonly _title?: string;
  readonly _content: any[];
  readonly _total?: number;
  readonly _columns: string[];
  readonly _columnsNames?: string[];
  readonly _types?: Types[];
}
