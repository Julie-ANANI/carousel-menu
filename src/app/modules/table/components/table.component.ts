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

/***
 * This generic class generates a table
 */
export class TableComponent {

  /***
   * Input use to set the config for the tables linked with the back office
   * @param value
   */
  @Input() set config(value: any) {
    this.loadConfig(value);
  }

  /***
   * Input use to set the data
   * @param {Table} value
   */
  @Input() set data(value: Table) {
    this.loadData(value);
  }

  /***
   * Output call when the config change
   * @type {EventEmitter<any>}
   */
  @Output() configChange: EventEmitter<any> = new EventEmitter<any>();

  /***
   * Output call when the user click on the edit button
   * Send the corresponding row
   * @type {EventEmitter<any>}
   */
  @Output() editRow: EventEmitter<any> = new EventEmitter<any>();

  /***
   * Output call when the user click on the delete button
   * Send the list of selected rows
   * @type {EventEmitter<any>}
   */
  @Output() removeRows: EventEmitter<any> = new EventEmitter<any>();

  /***
   * Output call when the user click on one action
   * Send the string corresponding to the action and the list of selected rows
   * @type {EventEmitter<any>}
   */
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
  private _massSelection = false;

  constructor(private _translateService: TranslateService) {}

  /***
   * This function load and initialise the data send by the user
   * @param {Table} value
   */
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

  /***
   * This function initialise the values of a column
   */
  initialiseColumns() {
    this._columns.forEach((value1, index) => {
      this._columns[index]._isSelected = false,
        this._columns[index]._isHover = false});
  }

  /***
   * This function affects the config send by the user to this._config
   * @param value
   */
  loadConfig(value: any): void {
    this._config = value;
  }

  /***
   * This function is call when the user change the config
   * If it's the config is local, we call this.changeLocalConfig() to directly make the changes
   * If not, we emit the Output configChange
   * @param value
   */
  changeConfig(value: any): void {
    this._config = value;
    if (!this._isLocal) {
      this.configChange.emit(this._config);
    } else {
      Promise.resolve(null).then(() => this.changeLocalConfig());
    }
  }

  /***
   * This function reload the config when its change
   * @requires local config
   */
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

  /***
   * This function is call when the user click on the edit button
   * Emit the Output editRow
   * @param {Row} row
   */
  edit(row: Row) {
    this.editRow.emit(row._content);
  }

  /***
   * This function is call when the user click on the delete button
   * Emit the Output removeRows
   */
  removeSelectedRows() {
    if (this._massSelection && this._total > this._content.length) {
      this.removeRows.emit('all');
    } else {
      this.removeRows.emit(this.getSelectedRowsContent());
    }
  }

  /***
   * This function is call when the user click on one of the actions button
   * Emit the Output performAction
   * @param {string} action
   */
  onActionClick(action: string) {
    if (this._massSelection) {
      this.performAction.emit({_action: action, _rows: 'all'});
    } else {
      this.performAction.emit({_action: action, _rows: this.getSelectedRowsContent()});
    }
  }

  /***
   * This function returns the keys of the table
   * @returns {string[]}
   */
  getRowsKeys(): string[] {
    if (this._isLocal) {
      return Object.keys(this._filteredContent);
    } else {
      return Object.keys(this._content);
    }
  }

  /***
   * This function returns the content of the column basing on the rowKey and the column(s) attribute(s)
   * @param {string} rowKey
   * @param {string} columnAttr
   * @returns {any}
   */
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

  /***
   * This function returns the type of the column in argument
   * @param {Column} column
   * @returns {types}
   */
  getType(column: Column): types {
    return column._type;
  }

  /***
   * This function returns the attribute(s) of the column
   * @param {Column} column
   * @returns {string[]}
   */
  getAttrs(column: Column) {
    return column._attrs;
  }

  /***
   * This function returns the index of one attribute of a column
   * @param {Column} column
   * @param {string} attr
   * @returns {number}
   */
  getAttrIndex(column: Column, attr: string) {
    return this.getAttrs(column).findIndex(value => value === attr);
  }

  /***
   * This function returns the name of a column
   * @param {Column} column
   * @returns {string | undefined}
   */
  getName(column: Column) {
    return column._name;
  }

  /***
   * This function returns the choices of a column
   * @requires type of the column 'MULTI_CHOICES'
   * @param {Column} column
   * @returns {Choice[]}
   */
  getChoices(column: Column): Choice[] {
    return column._choices || [];
  }

  /***
   * This function returns the choice corresponding to one column and a string
   * @requires type of the column 'MULTI_CHOICES'
   * @param {Column} column
   * @param {string} name
   * @returns {Choice}
   */
  getChoice(column: Column, name: string): Choice {
    return this.getChoices(column).find(value => value._name === name) || {_name: '', _class: ''};
  }

  /***
   * This function return the alias of a choice that will be show to the user instead of the initial name
   * @param {Choice} choice
   * @returns {any}
   */
  getChoiceAlias(choice: Choice) {
    if (choice) {
      return choice._alias || choice._name;
    } else {
      return ' - ';
    }
  }

  /***
   * This function returns the label corresponding to a choice
   * @param {Choice} choice
   * @returns {string}
   */
  getChoiceClass(choice: Choice): string {
    return choice._class || '';
  }

  /***
   * This function returns the url of a picture corresponding to a choice
   * @param {Choice} choice
   * @returns {string}
   */
  getUrl(choice: Choice): string {
    return choice._url || '';
  }

  /***
   * This function returns one label of a multilabel
   * @param {Column} column
   * @param {string} attr
   * @returns {MultiLabel | {}}
   */
  getMultiLabel(column: Column, attr: string) {
    return column._multiLabels.find(value => value._attr === attr) || {};
  }

  /***
   * This function returns the class of one label of a multilabel
   * @param {MultiLabel} multiLabel
   * @returns {string}
   */
  getMultiLabelClass(multiLabel: MultiLabel): string {
    return multiLabel._class;
  }

  /***
   * This function returns all the selected rows
   * @returns {Row[]}
   */
  getSelectedRows(): Row[] {
    if (this._massSelection && this._total > this._content.length) {
      return [];
    } else {
      return this._content.filter(value => value._isSelected === true);
    }
  }

  /***
   * This function returns the number of selected rows
   * @returns {number}
   */
  getSelectedRowsNumber(): number {
    if (this._massSelection) {
      return this._total;
    } else {
      return this.getSelectedRows().length;
    }
  }

  /***
   * This function returns the content of the selected rows
   * @returns {any[]}
   */
  getSelectedRowsContent(): any[] {
    const content: any[] = [];
    this.getSelectedRows().forEach(value => content.push(value._content));
    return content;
  }

  /***
   * This function change the selected value of a row to the opposite
   * @param {string} key
   */
  selectRow(key: string): void {
    if (this._isSelectable) {
      this._isLocal
        ? this._filteredContent[key]._isSelected = !(this._filteredContent[key]._isSelected)
        : this._content[key]._isSelected = !(this._content[key]._isSelected); this._massSelection = false;
    }
  }

  /***
   * This function is call when the user click on a column
   * change the column selected value to true
   * @param {string} key
   */
  selectColumn(key: string) {
    this.initialiseColumns();
    const index = this._columns.findIndex(value => value._attrs[0] === key);
    this._columns[index]._isSelected = true;
  }

  /***
   * This function allows to select all the rows
   * @param e
   */
  selectAll(e: any): void  {
    if (this._isLocal) {
      this._filteredContent.forEach(value => { value._isSelected = e.srcElement.checked; })
    } else {
      this._content.forEach(value => { value._isSelected = e.srcElement.checked; });
      this._massSelection = e.srcElement.checked;
    }
  }

  /***
   * This function returns if a rows is selected or not
   * @param content
   * @returns {boolean}
   */
  isSelected(content: any): boolean {
    return content._isSelected
  }

  /***
   * This function returns if a column is already sort or not
   * @param {Column} content
   * @returns {boolean}
   */
  isSort(content: Column): boolean {
    if (content !== null && this.config && this.config.sort !== null) {
      return this._config.sort[this.getAttrs(content)[0]];
    } else {
      return false;
    }
  }

  /***
   * This function sort the content of the Table depending on one column
   * @requires local config
   * @param {string} key
   */
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

  /***
   * This function returns if a column is sortable or not
   * @param {Column} column
   * @returns {boolean}
   */
  isSortable(column: Column) {
    return column._isSortable === undefined ? true : column._isSortable;
  }

  /***
   * This function filter the Table content basing on a column
   * @param {string} key
   * @param {boolean} isSearch
   */
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

  /***
   * This function returns a color depending on the percentage
   * @param {number} length
   * @returns {string}
   */
  getColor(length: number) {
    if (length < 34 && length >= 0) {
      return '#EA5858';
    } else if (length >= 34 && length < 67) {
      return '#f0ad4e';
    } else {
      return '#2ECC71';
    }
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
    return this.getSelectedRowsNumber();
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
