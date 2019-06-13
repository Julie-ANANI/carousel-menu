import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Table } from '../models/table';
import { Row } from '../models/row';
import { Column, types } from '../models/column';
import { Choice } from '../models/choice';
import { TranslateService } from '@ngx-translate/core';
import { countries } from '../../../models/static-data/country';
import { Config } from '../../../models/config';
import { Pagination } from '../../utility-components/paginations/interfaces/pagination';
import { LocalStorageService } from '../../../services/localStorage/localStorage.service';
//import { isPlatformBrowser } from '@angular/common';
//import { PaginationInterface } from '../../utility-components/paginations/interfaces/pagination';
//import { countries } from "../../../models/static-data/country";


@Component({
  selector: 'app-shared-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

/***
 * This generic class generates a table.
 */
export class TableComponent implements OnInit {

  /***
   * Input use to set the data
   * @param {Table} value
   */
  @Input() set data(value: Table) {
    this._loadData(value);

    /*if (this._isLocal) {
      // this.changeLocalConfig();
    }*/

  }

  /***
   * Input use to set the config for the tables linked with the back office
   * @param value
   */
  @Input() set config(value: Config) {
    this._config = value;
  }


  /***
   * Output call when the config change
   * @type {EventEmitter<Config>}
   */
  @Output() configChange: EventEmitter<Config> = new EventEmitter<Config>();


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

  /***
   * Output call when the user selects one row
   * Send the list of selected rows
   * @type {EventEmitter<any>}
   */
  @Output() selectRowAction: EventEmitter<any> = new EventEmitter<any>();

  private _table: Table; // default table data.

  isSearching: boolean;

  private _massSelection: boolean;

  private _config: Config;

  private _pagination: Pagination;

  //private _selector: string; // for the pagination.

  //private _title: string; // set the title.

  //private _isNoTitle: boolean; // no need of the title.

  //private _isSelectable: boolean; // to select the rows or not.

  //private _isEditable: boolean; // to set the row can be edit or not.

  //private _isLocal: boolean; // to set the pagination locally.

  //private _isDeletable: boolean; // to delete the rows.

  //private _isFiltrable: boolean; // to filter the table by columns.

  //private _isNotPaginable: boolean; // to set the pagination required or not.

  //private _total: number; // to set the number of rows. By default always set its value to -1.

  //private _content = [];

  //private _columns: Column[] = [];

  //private _actions: string[] = [];

  //private _editIndex: number; // to set the position of the button.

  private _filteredContent: Row[] = [];

  //private _isShowable = false;

  //private _paginationConfig: PaginationInterface = {}; // to set the pagination.

  //private _reloadColumns = false;















  constructor(//@Inject(PLATFORM_ID) private _platformId: Object,
              private _translateService: TranslateService,
              private _localStorageService: LocalStorageService) {

    this._initializeTable();

    console.log(this._table);

  }


  ngOnInit(): void {
  }


  /***
   * this function is to initialize the table with default values.
   * @private
   */
  private _initializeTable() {
    this._table = {
      _selector: '',
      _title: 'TABLE.TITLE.RESULTS',
      _total: -1,
      _editIndex: 1,
      _columns: [],
      _content: [],
      _actions: [],
    }
  }

  /***
   * This function load and initialise the data send by the user
   * @param {Table} data
   */
  private _loadData(data: Table): void  {
    if (data) {
      this._table = data;
      this._initializeColumns();
      this._initializeContents();

      const localParPageValue =  parseInt(this._localStorageService.getItem(`${this._table._selector}-limit`), 10);
      this._setPagination(localParPageValue, Number(this._config.offset));

      console.log(this._table);
    }
    // if (value) {
    //   this._title = value._title;
    //
    //   this._selector = value._selector;
    //
    //   this._content = [];
    //   value._content.forEach(value1 => this._content.push({_isSelected: false, _content: value1}));
    //
    //   this._filteredContent = this._content;
    //
    //   this._isHeadable = value._isHeadable || false;
    //   this._isNoTitle = value._isNoTitle || false;
    //   this._isSelectable = value._isSelectable || false;
    //   this._isEditable = value._isEditable || false;
    //   this._isShowable = value._isShowable || false;
    //   this._isDeletable = value._isDeletable || false;
    //   this._isFiltrable = value._isFiltrable || false;
    //   this._isNotPaginable = value._isNotPaginable || false;
    //   this._reloadColumns = value._reloadColumns || false;
    //   this._isLocal = value._isLocal || false;
    //   this._editIndex = value._editIndex || 1;
    //
    //   this._total = value._total;
    //
    //   if (this._columns.length === 0 || this._reloadColumns) {
    //     // Si on a plus de 10 colonnes, on ne prends que les 10 premières
    //     value._columns.length > 10 ? this._columns = value._columns.slice(0, 10) : this._columns = value._columns;
    //
    //     this.initialiseColumns();
    //   }
    //
    //   this._actions = value._actions || [];
    // }
  }

  /***
   * This function initialise the values of a column.
   */
  private _initializeColumns() {
    this._table._columns.forEach((value, index) => {
      this._table._columns[index]._isSelected = false;
      this._table._columns[index]._isHover = false;
    });
  }

  /***
   * This function initialise the values of a content.
   */
  private _initializeContents() {
    this._table._content.forEach((value, index) => {
      this._table._content[index]._isSelected = false;
    });
  }

  /***
   * This function sets the pagination value.
   */
  private _setPagination(parPage: number, offset: number) {
    this._pagination = {
      propertyName: this._table._selector,
      totalCount: this._table._total,
      parPage: parPage ? parPage : 10,
      offset: offset || 0
    }
  }

  /***
   * This function returns the number of selected rows
   * @returns {number}
   */
  private _getSelectedRowsNumber(): number {
    if (this._massSelection) {
      return this._table._content.length;
    } else {
      return this.getSelectedRows().length;
    }
  }

  /***
   * This function allows to select all the rows
   * @param event
   */
  public selectAll(event: Event): void  {
    event.preventDefault();
    this._table._content.forEach((value) => {
      value._isSelected = event.target['checked'];
    });
    this._massSelection = event.target['checked'];
    console.log(this._table);
  }

  /***
   * This function affects the config send by the user to this._config
   * @param value
   */
  /*private _loadConfig(value: Config) {
    this._config = value;
    // this._paginationConfig = {
    //   limit: value.limit || 10,
    //   offset: value.offset || 0
    // };
  }*/

  /***
   * This function is call when the user change the config
   * If it's the config is local, we call this.changeLocalConfig() to directly make the changes
   * If not, we emit the Output configChange
   * @param value
   */
  public filterConfigChange(value: Config) {
    this._config = value;
    // this._config = value;
    // this.fetchingResult = false;
    // if (!this._isLocal) {
    //   this.configChange.emit(this._config);
    // } else {
    //   Promise.resolve(null).then(() => this.changeLocalConfig());
    // }
  }

  private _sortConfigChange() {

  }


  /***
   * This function is call when the user change the paginations config
   * It affects the values and call changeConfig
   * @param value
   */
  changePaginationConfig(value: any) {
    // this._paginationConfig = value;
    // this._config.limit = value.limit;
    // this._config.offset = value.offset;
    // if (isPlatformBrowser(this._platformId)) {
    //   window.scroll(0, 0);
    // }
    // this.changeConfig(this._config);
    // this.selectAll(event);
  }

  /***
   * This function reload the config when its change
   * @requires local config
   */
  changeLocalConfig() {
    // this._filteredContent = this._content;
    // for (const key of Object.keys(this._config)) {
    //   switch (key) {
    //     case('limit') : {
    //       break;
    //     }
    //     case('offset'): {
    //       break;
    //     }
    //     case ('search'): {
    //       for (const search of Object.keys(this._config['search'])) {
    //         this.filterAttribute(search, true);
    //       }
    //       break;
    //     }
    //     case('sort'): {
    //       for (const sortKey of Object.keys(this._config['sort'])) {
    //         this.sortColumn(sortKey);
    //       }
    //       break;
    //     } default : {
    //       this.filterAttribute(key, false);
    //       break;
    //   }
    //   }
    // }
    //
    // this._total = this._filteredContent.length;
    //
    // if (!this._isNotPaginable) {
    //   this._filteredContent = this._filteredContent.slice(this._config.offset, this._config.offset + Number(this._config.limit));
    // }

  }

  /***
   * This function returns the label of the button.
   */
  public getButtonLabel(): string {
    if (this._table._editButtonLabel) {
      return this._table._editButtonLabel;
    } else {
      return this._table._isEditable ? 'COMMON.BUTTON.EDIT' : 'COMMON.BUTTON.SHOW';
    }
  }

  /***
   * This function is call when the user click on the edit button
   * Emit the Output editRow
   * @param {Row} row
   */
  public edit(row: Row) {
    this.editRow.emit(row);
  }

  /***
   * This function is call when the user click on the delete button
   * Emit the Output removeRows
   */
  public removeSelectedRows() {

    if (this._massSelection) {
      const rows: Array<any> = [];
      this._table._content.forEach((content) => {
        rows.push(content);
      });
      this.removeRows.emit(rows);
    } else {
      this.removeRows.emit(this._getSelectedRowsContent());
    }

}

  /***
   * This function is call when the user click on one of the actions button
   * Emit the Output performAction
   * @param {string} action
   */
  public onActionClick(action: string) {

    if (this._massSelection) {
      const rows: Array<any> = [];
      this._table._content.forEach((content) => {
        rows.push(content);
      });
      this.performAction.emit({_action: action, _rows: rows});
    } else {
      this.performAction.emit({_action: action, _rows: this._getSelectedRowsContent()})
    }

  }

  /**
   * This function is called when the user selects one row. It will emit the selected rows
   */
  onSelectAction() {
    // if (this._massSelection) {
    //   this.selectRowAction.emit({ _rows: 'all'});
    // } else {
    //   this.selectRowAction.emit({ _rows: this.getSelectedRowsContent()});
    // }
  }

  /***
   * This function returns the keys of the table
   * @returns {string[]}
   */
  public getRowsKeys(): string[] {
    return Object.keys(this._table._content);
  }

  /***
   * This function returns the content of the column basing on the rowKey and the column(s) attribute(s)
   * @param {string} rowKey
   * @param {string} columnAttr
   * @returns {any}
   */
  public getContentValue(rowKey: string, columnAttr: string): any  {

    if (this._table && this._table._content && this._table._content.length > 0) {

      if (columnAttr.split('.').length > 1) {
        let newColumnAttr = columnAttr.split('.');

        let tmpContent = this._table._isLocal ? this._filteredContent[rowKey]._content[newColumnAttr[0]] : this._table._content[rowKey][newColumnAttr[0]];

        newColumnAttr = newColumnAttr.splice(1);

        for (const i of newColumnAttr){
          tmpContent = tmpContent ? tmpContent[i] : '-';
        }

        return tmpContent || '';

      } else {

        if (this._table._isLocal) {
          return this._filteredContent[rowKey]._content[columnAttr] || '';
        } else {
          if (this._table._content[rowKey] && this._table._content[rowKey][columnAttr]) {
            return this._table._content[rowKey][columnAttr];
          }
        }

      }

      return '';

    }

  }

  /***
   * This function returns the type of the column in argument
   * @param {Column} column
   * @returns {types}
   */
  public getType(column: Column): types {
    return column._type;
  }

  /***
   * This function returns the attribute(s) of the column
   * @param {Column} column
   * @returns {string[]}
   */
  public getAttrs(column: Column) {
    return column._attrs;
  }

  /***
   * This function returns the index of one attribute of a column
   * @param {Column} column
   * @param {string} attr
   * @returns {number}
   */
  public getAttrIndex(column: Column, attr: string) {
    return this.getAttrs(column).findIndex(value => value === attr);
  }

  /***
   * This function returns the name of a column
   * @param {Column} column
   * @returns {string | undefined}
   */
  public getName(column: Column) {
    return column._name;
  }

  /***
   * This function returns the choices of a column
   * @requires type of the column 'MULTI_CHOICES'
   * @param {Column} column
   * @returns {Choice[]}
   */
  public getChoices(column: Column): Choice[] {
    return column._choices || [];
  }

  /***
   * This function returns the choice corresponding to one column and a string
   * @requires type of the column 'MULTI_CHOICES'
   * @param {Column} column
   * @param {string} name
   * @returns {Choice}
   */
  public getChoice(column: Column, name: string): Choice {
    return this.getChoices(column).find(value => value._name === name) || { _name: '', _class: '' };
  }

  /***
   * This function return the alias of a choice that will be show to the user instead of the initial name
   * @param {Choice} choice
   * @returns {any}
   */
  public getChoiceAlias(choice: Choice) {
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
  public getChoiceClass(choice: Choice): string {
    return choice._class || '';
  }

  /***
   * This function returns the url of a picture corresponding to a choice
   * @param {Choice} choice
   * @returns {string}
   */
  public getUrl(choice: Choice): string {
    return choice._url || '';
  }

  /***
   * This function returns one label of a multilabel
   * @param {Column} column
   * @param {string} attr
   * @returns {MultiLabel | {}}
   */
  public getMultiLabel(column: Column, attr: string) {
    return column._multiLabels.find(value => value._attr === attr) || {};
  }

  /***
   * This function returns the class of one label of a multilabel
   * @param multiLabel
   */
  public getMultiLabelClass(multiLabel: any): string {
    return multiLabel._class;
  }

  /***
   * This function returns all the selected rows
   * @returns {Row[]}
   */
  public getSelectedRows(): Row[] {
    return this._table._content.filter((content) => content._isSelected === true );
  }



  /***
   * This function returns the content of the selected rows
   * @returns {any[]}
   */
  private _getSelectedRowsContent(): any[] {
    const content: any[] = [];
    this.getSelectedRows().forEach(value => content.push(value));
    return content;
  }

  /***
   * This function change the selected value of a row to the opposite
   * @param {string} key
   */
  public selectRow(key: string): void {
    if (this._table._isSelectable) {
      this._table._content[key]._isSelected = !(this._table._content[key]._isSelected);
      this._massSelection = false;
    }
  }

  /***
   * This function is call when the user click on a column
   * change the column selected value to true
   * @param {string} key
   */
  public selectColumn(key: string) {
    this._initializeColumns();
    const index = this._table._columns.findIndex(value => value._name === key);
    this._table._columns[index]._isSelected = true;
  }

  /***
   * This function returns if a rows is selected or not
   * @param content
   * @returns {boolean}
   */
  public isSelected(content: any): boolean {
    return !!content && !!content._isSelected;
  }

  /***
   * This function returns if a column is already sort or not
   * @param {Column} content
   * @returns {boolean}
   */
  isSort(content: Column): boolean {
    // if (content !== null && this.config && this.config.sort !== null) {
    //   return this._config.sort[this.getAttrs(content)[0]];
    // } else {
    //   return false;
    // }
    return ;
  }

  /***
   * This function sort the content of the Table depending on one column
   * @requires local config
   * @param {string} key
   */
  sortColumn(key: string) {
    // if ((this._columns.find(value => value._attrs[0] === key))) {
    //   const sortArray = this._filteredContent.slice();
    //   this._filteredContent = sortArray.sort((a, b) => {
    //     const valueA = this.getContentValue(this._filteredContent.findIndex(value => JSON.stringify(value._content) === JSON.stringify(a._content)).toString() , key).toString();
    //     const valueB = this.getContentValue(this._filteredContent.findIndex(value => JSON.stringify(value._content) === JSON.stringify(b._content)).toString() , key).toString();
    //     return this._config.sort[key] * (valueA.localeCompare(valueB));
    //   });
    // }
  }

  /***
   * This function returns if a column is sortable or not
   * @param {Column} column
   * @returns {boolean}
   */
  public isSortable(column: Column) {
    return column._isSortable === undefined ? true : column._isSortable;
  }

  /***
   * This function filter the Table content basing on a column
   * @param {string} key
   * @param {boolean} isSearch
   */
  filterAttribute(key: string, isSearch: boolean) {
    // if ((this._columns.find(value => value._attrs[0] === key))) {
    //   let word: RegExp = null;
    //   if (isSearch) {
    //     word = new RegExp(this._config.search[key], 'gi');
    //   } else {
    //     word = new RegExp(this._config[key], 'gi');
    //   }
    //
    //   const columnToFilter = this._columns.find(value => value._attrs[0] === key);
    //
    //   this._filteredContent = this._filteredContent.filter((value, index) => {
    //     if (columnToFilter._type === 'COUNTRY') {
    //       return !this.getContentValue(index.toString(), key).flag.toLowerCase().search(word);
    //     } else {
    //       return !this.getContentValue(index.toString(), key).toLowerCase().search(word);
    //     }
    //   });
    // }
  }

  /***
   * This function returns a color depending on the percentage
   * @param {number} length
   * @returns {string}
   */
  public getColor(length: number): string {
    if (length < 34 && length >= 0) {
      return '#EA5858';
    } else if (length >= 34 && length < 67) {
      return '#f0ad4e';
    } else {
      return '#2ECC71';
    }
  }

  public getCountryName(isoCode: string): string {
    if(isoCode) {
      return countries[isoCode] || "NA";
    } else {
      return "NA";
    }
  }

  get table(): Table {
    return this._table;
  }

  get selectedRows(): number {
    return this._getSelectedRowsNumber();
  }

  get sortConfig(): string {
    return this._config.sort;
  }

  set sortConfig(value: string) {
    this._config.sort = value;
    this._sortConfigChange();
  }

  get pagination(): Pagination {
    return this._pagination;
  }

  set pagination(value: Pagination) {
    console.log(value);
    this._pagination = value;
  }

  /*get selector(): string {
    return this._selector;
  }*/

  /*get title(): string {
    return this._title;
  }*/

  /*get isSelectable(): boolean {
    return this._isSelectable;
  }*/

  /*get isEditable(): boolean {
    return this._isEditable;
  }*/

  /*get isNoTitle(): boolean {
    return this._isNoTitle;
  }*/

  /*get isLocal(): boolean {
    return this._isLocal;
  }*/

 /* get isShowable(): boolean {
    return this._isShowable;
  }*/

  /*get isDeletable(): boolean {
    return this._isDeletable;
  }*/

  /*get isFiltrable(): boolean {
    return this._isFiltrable;
  }*/

  /*get isNotPaginable(): boolean {
    return this._isNotPaginable;
  }*/

  /*get content(): Row[] {
    return this._content;
  }*/

  /*get columns(): Column[] {
    return this._columns;
  }*/

  /*get total(): number {
    return this._total;
  }*/

  get config(): Config {
    return this._config;
  }

  /*get actions(): string[] {
    return this._actions;
  }*/


  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get filteredContent(): Row[] {
    return this._filteredContent;
  }

  /*get paginationConfig(): PaginationInterface {
    return this._paginationConfig;
  }*/

  /*set content(value: Row[]) {
    this._content = value;
  }*/

  get userLang(): string {
    return this._translateService.currentLang;
  }

  get massSelection(): boolean {
    return this._massSelection;
  }

  /*get editIndex(): number {
    return this._editIndex;
  }*/

}
