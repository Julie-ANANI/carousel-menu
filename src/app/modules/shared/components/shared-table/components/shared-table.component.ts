import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Table} from '../models/table';
import {Row} from '../models/row';
import {Types} from '../models/types';

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

  @Output() editRow: EventEmitter<any> = new EventEmitter<any>();

  @Output() removeRows: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Output() performAction: EventEmitter<any> = new EventEmitter<any>();

  private _title = 'Résultats';
  private _isSelectable = false;
  private _isEditable = false;
  private _isDeletable = false;
  private _content: Row[] = [];
  private _total = 0;
  private _columns: string[] = [];
  private _columnsNames: string[] = [];
  private _types: Types[];
  private _actions: string[] = [];
  private _selectedRows = 0;

  private _config: any = null;

  constructor() {}

  loadData(value: Table): void  {
    this._title = value._title || 'Résultats';

    // Si le tableau contient plus de ligne que la limit, on le vide
    // (c'est le cas lorsque l'on passe de 50 lignes par pages à 10 lignes par pages par exemple)
    if (this._content.length > this._config.limit) {
      this._content = [];
    }

    // Pour chaque valeur qu'on souhaite insérer, on va chercher si elle n'est pas déjà dans le tableau content
    // Si ce n'est pas le cas on insère une nouvelle Row dans content
    value._content.forEach(value1 => {
      if (!this._content.find(value2 => JSON.stringify(value2._content) === JSON.stringify(value1))) {
        this._content.push({_isHover: false, _isSelected: false, _content: value1})
      }
    });

    this._isSelectable = value._isSelectable || false;
    this._isEditable = value._isEditable || false;
    this._isDeletable = value._isDeletable || false;
    this._total = value._total;

    // Si on a plus de 10 colonnes, on ne prends que les 10 premières
    value._columns.length > 10
      ? this._columns = value._columns.slice(0, 10)
      : this._columns = value._columns;

    // On regarde si il existe des noms pour les colonnes
    // Si oui on les stocke (uniquement les 10 premiers champs (si il y en a plus que 10)
    // Sinon on va afficher les noms des attributs en majuscule
    if (value._columnsNames) {
      value._columnsNames.length > 10
        ? this._columnsNames = value._columnsNames.slice(0, 10)
        : this._columnsNames = value._columnsNames
    } else {
      this._columnsNames = this._columns.map(value1 => {return value1.toUpperCase()});
    }


    this._types = value._types;
    this._actions = value._actions || [];
  }

  loadConfig(value: any): void {
    this._config = value;
  }

  changeConfig(value: any): void {
    this._config = value;
    this.configChange.emit(this._config);
  }

  edit(row: Row) {
    this.editRow.emit(row._content);
  }

  onActionClick(action: string) {
    this.performAction.emit({_action: action, _rows: this.getSelectedRowsContent()});
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

  get isSelectable(): boolean {
    return this._isSelectable;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  get isDeletable(): boolean {
    return this._isDeletable;
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

  get actions(): string[] {
    return this._actions;
  }

  get selectedRows(): number {
    return this._selectedRows;
  }

  getSelectedRows(): Row[] {
    return this._content.filter(value => value._isSelected === true);
  }

  getSelectedRowsContent(): any[] {
    const content: any[] = [];
    this.getSelectedRows().forEach(value => content.push(value._content));
    return content;
  }

  removeSelectedRows() {

    this.removeRows.emit(this.getSelectedRowsContent());
  }

  selectRow(key: string): void {
    if (this._isSelectable) {
      this._content[key]._isSelected = !(this._content[key]._isSelected);
      this._content[key]._isSelected ? this._selectedRows++ : this._selectedRows--;
    }
  }

  hoverRow(key: string): void {
    this._content[key]._isHover = !(this._content[key]._isHover);
  }

  isSelected(row: Row): boolean {
    return row._isSelected;
  }

  isHover(row: Row) {
    return row._isHover;
  }

  selectAll(e: any): void  {
      this._content.forEach(value => { value._isSelected = e.srcElement.checked; });
      e.srcElement.checked ? this._selectedRows = this._content.length : this._selectedRows = 0;
  }

}
