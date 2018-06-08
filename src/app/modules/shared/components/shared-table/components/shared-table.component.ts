import { Component, Input} from '@angular/core';
import {Table} from '../interfaces/table';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent {

  @Input() set data(value: Table) {
    this.loadData(value);
  }

  private _infos: Table;

  constructor() {}

  loadData(value: Table): void
  {
    this._infos = value;
  }

  getColumnsNames(): string[]
  {
    return this._infos._columnsNames;
  }

  getColumns(): string[]
  {
    return this._infos._columns;
  }

  getFieldsKeys(): string[]
  {
    return Object.keys(this._infos._content);
  }

  getContentValue(fieldKey: string, columnKey: string)
  {
    return this._infos._content[fieldKey][columnKey];
  }

}
