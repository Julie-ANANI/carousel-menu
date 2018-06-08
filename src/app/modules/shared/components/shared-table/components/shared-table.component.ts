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

  getColumns(): string[]
  {
    return this._infos._columns;
  }

  getFields(): Array<object>
  {
    return this._infos._content;
  }

  getFieldContent(set: object): any
  {
    return JSON.parse(JSON.stringify(set), (key, value) => {
      if (typeof value === 'string') {
        return value.toUpperCase();
      }
      return value;
    });
  }

}
