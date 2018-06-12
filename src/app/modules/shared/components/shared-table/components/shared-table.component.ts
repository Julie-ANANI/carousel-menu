import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Table} from '../interfaces/table';
import {Row} from '../interfaces/row';
import {Types} from '../interfaces/types';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss']
})
export class SharedTableComponent {

  @Input() set config(value: any) {
    this.loadConfig(value);
  }

  @Input() set data(value: Table) {
    this.loadData(value);
  }

  @Output() configChange: EventEmitter<any> = new EventEmitter<any>();

  private _title = 'Résultats';
  private _content: Row[] = [];
  private _total = 0;
  private _columns: string[] = [];
  private _columnsNames: string[] = [];
  private _types: Types[];
  private _selectedRows = 0;

  private _config: any = null;

  constructor() {}

  loadData(value: Table): void  {
    this._title = value._title;

    // Si le tableau contient plus de ligne que la limit, on le vide
    // (c'est le cas lorsque l'on passe de 50 lignes par pages à 10 lignes par pages par exemple)
    if (this._content.length > this._config.limit) {
      this._content = [];
    }

    // Pour chaque valeur qu'on souhaite insérer, on va chercher si elle n'est pas déjà dans le tableau content
    // Si ce n'est pas le cas on insère une nouvelle Row dans content
    value._content.forEach(value1 => {
      if (!this._content.find(value2 => JSON.stringify(value2._content) === JSON.stringify(value1))) {
        this._content.push({_isSelected: false, _content: value1})
      }
    });

    this._total = value._total;
    this._columns = value._columns;
    this._columnsNames = value._columnsNames;
    this._types = value._types;
  }

  loadConfig(value: any): void {
    this._config = value;
  }

  changeConfig(value: any): void {
    this._config = value;
    this.configChange.emit(this._config);
  }

  getRowsKeys(): string[] {
    return Object.keys(this._content);
  }

  getContentValue(rowKey: string, columnKey: string): any  {
    return this._content[rowKey]._content[columnKey];
  }

  getType(columnIndex: number): Types {
    return this._types[columnIndex];
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

  get config(): any {
    return this._config;
  }

  get types(): Types[] {
    return this._types;
  }

  selectRow(key: string): void {
    this._content[key]._isSelected = !(this._content[key]._isSelected);
    this._selectedRows++;
  }

  isSelected(row: Row): boolean {
    return row._isSelected;
  }

  selectAll(e: any): void  {
      this._content.forEach(value => { value._isSelected = e.srcElement.checked; });
  }

}
