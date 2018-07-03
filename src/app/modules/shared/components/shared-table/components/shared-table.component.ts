import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Table} from '../models/table';
import {Row} from '../models/row';
import {Column, types} from '../models/column';
import {Choice} from '../models/choice';
import {TranslateService} from '@ngx-translate/core';
import {MultiLabel} from '../models/multi-label';

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

  private _selector = '';
  private _title = 'Résultats';
  private _isHeadable = false;
  private _isSelectable = false;
  private _isEditable = false;
  private _isDeletable = false;
  private _isFiltrable = false;
  private _isSortable = false;
  private _isNotPaginable = false;
  private _content: Row[] = [];
  private _total = 0;
  private _columns: Column[] = [];
  private _actions: string[] = [];

  private _config: any = null;

  constructor(private _translateService: TranslateService) {}

  loadData(value: Table): void  {
    if (value) {
      this._title = value._title || 'Résultats';

      this._selector = value._selector;

      this._content = [];
      value._content.forEach(value1 => this._content.push({_isHover: false, _isSelected: false, _content: value1}));

      this._isHeadable = value._isHeadable || false;
      this._isSelectable = value._isSelectable || false;
      this._isEditable = value._isEditable || false;
      this._isDeletable = value._isDeletable || false;
      this._isFiltrable = value._isFiltrable || false;
      this._isSortable = value._isSortable || false;

      this._isNotPaginable = value._isNotPaginable || false;

      this._total = value._total;

      if (this._columns.length === 0) {
        // Si on a plus de 10 colonnes, on ne prends que les 10 premières
        value._columns.length > 10
          ? this._columns = value._columns.slice(0, 10)
          : this._columns = value._columns;

        this.initialiseColumns();
      }

      this._actions = value._actions || [];
    }
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

  getContentValue(rowKey: string, columnAttr: string): any  {
    if (columnAttr.split('.').length > 1) {
      let newColumnAttr = columnAttr.split('.');
      let tmpContent = this._content[rowKey]._content[newColumnAttr[0]];
      newColumnAttr = newColumnAttr.splice(1);
      for (const i of newColumnAttr){
        tmpContent = tmpContent[i];
      }
      return tmpContent;
    }else {
      return this._content[rowKey]._content[columnAttr];
    }
  }

  getType(column: Column): types {
    return column._type;
  }

  getAttrs(column: Column) {
    return column._attrs;
  }

  getAttrIndex(column: Column, attr: string) {
    return this.getAttrs(column).findIndex(value => value === attr);
  }

  getName(column: Column) {
    return column._name;
  }

  getChoices(column: Column): Choice[] {
    return column._choices || [];
  }

  getChoice(column: Column, name: string): Choice {
    return this.getChoices(column).find(value => value._name === name) || {_name: '', _class: ''};
  }

  getChoiceName(choice: Choice): string {
    return choice._name || '';
  }

  getChoiceClass(choice: Choice): string {
    return choice._class || '';
  }

  getUrl(choice: Choice): string {
    return choice._url || '';
  }

  getMultiLabels(column: Column): MultiLabel[] {
    return column._multiLabels || [];
  }

  getMultiLabel(column: Column, attr: string) {
    return column._multiLabels.find(value => value._attr === attr) || {_attr: '', _class: ''};
  }

  getMultiLabelIndex(column: Column, multiLabel: MultiLabel) {
    return this.getMultiLabels(column).findIndex(value => value._attr === multiLabel._attr);
  }

  getMultiLabelClass(multiLabel: MultiLabel): string {
    return multiLabel._class;
  }

  getMultiChoiceAttr(multiLabel: MultiLabel) {
    return multiLabel._attr;
  }

  get selector(): string {
    return this._selector;
  }

  get title(): string {
    return this._title;
  }

  get isHeadable(): boolean {
    return this._isHeadable;
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

  get isFiltrable(): boolean {
    return this._isFiltrable;
  }

  get isSortable(): boolean {
    return this._isSortable;
  }

  get isNotPaginable(): boolean {
    return this._isNotPaginable;
  }

  get content(): Row[] {
    return this._content;
  }

  get columns(): Column[] {
    return this._columns;
  }

  get total(): number {
    return this._total;
  }

  get config(): any {
    return this._config;
  }

  get actions(): string[] {
    return this._actions;
  }

  get selectedRows(): number {
    return this.getSelectedRows().length;
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
    }
  }

  hoverRow(key: string): void {
    this._content[key]._isHover = !(this._content[key]._isHover);
  }

  initialiseColumns() {
    this._columns.forEach((value1, index) => {
      this._columns[index]._isSelected = false,
      this._columns[index]._isHover = false});
  }

  selectColumn(key: string) {
    this.initialiseColumns();
    const index = this._columns.findIndex(value => value._attrs[0] === key);
    this._columns[index]._isSelected = true;
  }

  hoverColumn(key: string) {
    const index = this._columns.findIndex(value => value._attrs[0] === key);
    this._columns[index]._isHover = !(this._columns[index]._isHover);
  }

  isSelected(content: any): boolean {
    return content._isSelected;
  }

  isHover(content: any): boolean {
    return content._isHover;
  }

  selectAll(e: any): void  {
      this._content.forEach(value => { value._isSelected = e.srcElement.checked; });
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

}
