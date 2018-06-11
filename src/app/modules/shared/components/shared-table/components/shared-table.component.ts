import { Component, Input} from '@angular/core';
import {Table} from '../interfaces/table';
import {Row} from '../interfaces/row';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent {

  @Input() set data(value: Table) {
    this.loadData(value);
  }

  private _title = 'Résultats';
  private _content: Row[] = [];
  private _total = 0;
  private _columns: string[] = [];
  private _columnsNames: string[] = [];
  private _selectedRows = 0;

  constructor() {}

  loadData(value: Table): void
  {
    this._title = value._title;
    for (const c of value._content)
    {
      this._content.push({_isSelected: false, _content: c})
    }
    this._total = value._total;
    this._columns = value._columns;
    this._columnsNames = value._columnsNames;
  }

  getRowsKeys(): string[]
  {
    return Object.keys(this._content);
  }

  getContentValue(rowKey: string, columnKey: string): any
  {
    return this._content[rowKey]._content[columnKey];
  }

  get title(): string {
    return this._title;
  }

  get content(): Row[] {
    return this._content;
  }

  get total(): number {
    return this._total;
  }

  get columns(): string[] {
    return this._columns;
  }

  get columnsNames(): string[] {
    return this._columnsNames;
  }

  selectRow(key: string): void {
    this._content[key]._isSelected = !(this._content[key]._isSelected);
    this._selectedRows++;
  }

  isSelected(row: Row): boolean
  {
    return row._isSelected;
  }

  selectAll(e: any): void
  {
      this._content.forEach(value => { value._isSelected = e.srcElement.checked; });
  }

}
