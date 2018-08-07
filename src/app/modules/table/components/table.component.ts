import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Table} from '../models/table';
import {Row} from '../models/row';
import {Column, types} from '../models/column';
import {Choice} from '../models/choice';
import {TranslateService} from '@ngx-translate/core';
import {MultiLabel} from '../models/multi-label';

@Component({
  selector: 'app-shared-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

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
  private _isLocal = false;
  private _isShowable = false;
  private _isDeletable = false;
  private _isFiltrable = false;
  private _isNotPaginable = false;
  private _reloadColumns = false;
  private _content: Row[] = [];
  private _total = 0;
  private _columns: Column[] = [];
  private _actions: string[] = [];

  private _filteredContent: Row[] = [];

  editColumn = false;

  private _config: any = null;

  constructor(private _translateService: TranslateService) {}

  loadData(value: Table): void  {
    if (value) {
      this._title = value._title || 'Résultats';

      this._selector = value._selector;

      this._content = [];
      value._content.forEach(value1 => this._content.push({_isSelected: false, _content: value1}));

      this._filteredContent = this._content;

      this._isHeadable = value._isHeadable || false;
      this._isSelectable = value._isSelectable || false;
      this._isEditable = value._isEditable || false;
      this._isShowable = value._isShowable || false;
      this._isDeletable = value._isDeletable || false;
      this._isFiltrable = value._isFiltrable || false;
      this._isNotPaginable = value._isNotPaginable || false;
      this._reloadColumns = value._reloadColumns || false;
      this._isLocal = value._isLocal || false;

      this._total = value._total;

      if (this._columns.length === 0 || this._reloadColumns) {
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
    if (!this._isLocal) {
      this.configChange.emit(this._config);
    } else {
      Promise.resolve(null).then(() => this.changeLocalConfig());
    }
  }

  edit(row: Row) {
    this.editRow.emit(row._content);
  }

  onActionClick(action: string) {
    this.performAction.emit({_action: action, _rows: this.getSelectedRowsContent()});
  }

  getRowsKeys(): string[] {
    if (this._isLocal) {
      return Object.keys(this._filteredContent);
    } else {
      return Object.keys(this._content);
    }
  }

  getContentValue(rowKey: string, columnAttr: string): any  {
    if (columnAttr.split('.').length > 1) {
      let newColumnAttr = columnAttr.split('.');
      let tmpContent = this._isLocal
        ? this._filteredContent[rowKey]._content[newColumnAttr[0]]
        : this._content[rowKey]._content[newColumnAttr[0]];
      newColumnAttr = newColumnAttr.splice(1);
      for (const i of newColumnAttr){
        tmpContent = tmpContent ? tmpContent[i] : '-';
      }
      return tmpContent;
    }else {
      if (this._isLocal) {
        return this._filteredContent[rowKey]._content[columnAttr];
      } else {
        return this._content[rowKey]._content[columnAttr];
      }
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

  getChoiceAlias(choice: Choice) {
    if (choice) {
      return choice._alias || choice._name;
    } else {
      return ' - ';
    }
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
    return column._multiLabels.find(value => value._attr === attr) || {};
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
      this._isLocal
        ? this._filteredContent[key]._isSelected = !(this._filteredContent[key]._isSelected)
        : this._content[key]._isSelected = !(this._content[key]._isSelected);
    }
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

  isSort(content: Column): boolean {
    if (content !== null && this.config && this.config.sort !== null) {
      return this._config.sort[this.getAttrs(content)[0]];
    } else {
      return false;
    }
  }

  filterTextLocal(event: {prop: Column, text: string}) {
    if (event.text !== '') {
      if (event.prop._attrs[0].split('.').length > 1) {
        this._filteredContent = this._filteredContent.filter(value => {
          let attr = event.prop._attrs[0].split('.');
          let realContent = value._content[attr[0]];
          attr = attr.splice(1);
          for (const i of attr) {
            realContent = realContent[i];
          }
          return realContent.toLowerCase().includes(event.text);
        });
      } else {
        this._filteredContent = this._filteredContent.filter(value => {
          if (event.prop._type === 'COUNTRY') {
            return value._content[event.prop._attrs[0]].flag.toLowerCase().includes(event.text);
          } else {
            return value._content[event.prop._attrs[0]].toLowerCase().includes(event.text);
          }
        });
      }
    } else {
      this._filteredContent = this._content;
    }
  }

  changeLocalConfig() {
    this._filteredContent = this._content;
    for (const key of Object.keys(this._config)) {
      switch (key) {
        case('limit') : {
          break;
        }
        case('offset'): {
          break;
        }
        case ('search'): {
          for (const search of Object.keys(this._config['search'])) {
            this.filterAttribute(search, true);
          }
          break;
        }
        case('sort'): {
            for (const sortKey of Object.keys(this._config['sort'])) {
              this.sortColumn(sortKey);
            }
            break;
        } default : {
          this.filterAttribute(key, false);
          break;
        }
      }
    }

    this._total = this._filteredContent.length;
    if (!this._isNotPaginable) {
      this._filteredContent = this._filteredContent.slice(this._config.offset, this._config.offset + Number(this._config.limit));
    }
  }

  sortColumn(key: string) {
    if ((this._columns.find(value => value._attrs[0] === key))) {
      const sortArray = this._filteredContent.slice();
      this._filteredContent = sortArray.sort((a, b) => {
        const valueA = this.getContentValue(this._filteredContent.findIndex(value => JSON.stringify(value._content) === JSON.stringify(a._content)).toString() , key).toString();
        const valueB = this.getContentValue(this._filteredContent.findIndex(value => JSON.stringify(value._content) === JSON.stringify(b._content)).toString() , key).toString();
        return this._config.sort[key] * (valueA.localeCompare(valueB));
      });
    }
  }

  filterAttribute(key: string, isSearch: boolean) {
    if ((this._columns.find(value => value._attrs[0] === key))) {
      let word: RegExp = null;
      if (isSearch) {
        word = new RegExp(this._config.search[key], 'gi');
      } else {
        word = new RegExp(this._config[key], 'gi');
      }

      const columnToFilter = this._columns.find(value => value._attrs[0] === key);

      this._filteredContent = this._filteredContent.filter((value, index) => {
        if (columnToFilter._type === 'COUNTRY') {
          return !this.getContentValue(index.toString(), key).flag.toLowerCase().search(word);
        } else {
          return !this.getContentValue(index.toString(), key).toLowerCase().search(word);
        }
      });
    }
  }

  filterOtherLocal(event: {prop: Column, text: string}) {
    if (event.text !== '') {
      this._filteredContent = this._filteredContent.filter(value => {
        return value._content[event.prop._attrs[0]] === event.text;
      })
    } else {
      this._filteredContent = this._content;
    }
  }

  isSelected(content: any): boolean {
    return content._isSelected
  }

  isSortable(column: Column) {
    return column._isSortable === undefined ? true : column._isSortable;
  }

  selectAll(e: any): void  {
    this._isLocal
      ? this._filteredContent.forEach(value => { value._isSelected = e.srcElement.checked; })
      : this._content.forEach(value => { value._isSelected = e.srcElement.checked; });
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

  get isLocal(): boolean {
    return this._isLocal;
  }

  get isShowable(): boolean {
    return this._isShowable;
  }

  get isDeletable(): boolean {
    return this._isDeletable;
  }

  get isFiltrable(): boolean {
    return this._isFiltrable;
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

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get filteredContent(): Row[] {
    return this._filteredContent;
  }


  set content(value: Row[]) {
    this._content = value;
  }

}
