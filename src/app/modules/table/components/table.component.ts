import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Table } from '../models/table';
import { Row } from '../models/row';
import { Column, types } from '../models/column';
import { Choice } from '../models/choice';
import { TranslateService } from '@ngx-translate/core';
import { countries } from '../../../models/static-data/country';
import { Config } from '../../../models/config';
import { Pagination } from '../../utility-components/paginations/interfaces/pagination';

@Component({
  selector: 'app-shared-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {

  /***
   * Input use to set the config for the tables linked with the back office
   * @param value
   */
  @Input() set config(value: Config) {
    this._config = value;
  }

  /***
   * Input use to set the data
   * @param {Table} value
   */
  @Input() set data(value: Table) {
    this._loadData(value);
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
   * Output call when the user selects one row or
   * Send the list of selected rows
   * @type {EventEmitter<any>}
   */
  @Output() selectRows: EventEmitter<any> = new EventEmitter<any>();

  private _table: Table;

  private _isSearching: boolean;

  private _massSelection: boolean;

  private _config: Config;

  private _pagination: Pagination;

  constructor(private _translateService: TranslateService) {
    this._initializeTable();
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
      this._initializeVariables();
      this._checkSearching();
      this._initializeColumns();
      this._initializeContents();
      this._setPagination(Number(this._config.offset));
    }

  }

  private _initializeVariables() {
    this._massSelection = false;
    this._isSearching = false;
  }

  private _checkSearching() {
    if (this._config.search.length > 2  && this._table._total === 0) {
      this._isSearching = true;
    }
  }

  /***
   * This function initialise the values of a column.
   */
  private _initializeColumns() {
    this._table._columns.forEach((value, index) => {
      this._table._columns[index]._isSelected = false;
      this._table._columns[index]._isSearchable = this._table._columns[index]._isSearchable ? this._table._columns[index]._isSearchable : false;
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
  private _setPagination(offset: number) {
    this._pagination = {
      propertyName: this._table._selector,
      offset: offset,
      currentPage: this._pagination && this._pagination.currentPage ? this._pagination.currentPage : 1,
      previousPage: this._pagination && this._pagination.previousPage ? this._pagination.previousPage : 0,
      nextPage: this._pagination && this._pagination.nextPage ? this._pagination.nextPage : 2,
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

    this._onSelectRow();

  }

  /***
   * This function is called when the users either select the one row
   * or select all on the basis of that we emit the selected rows to the
   * parent component.
   */
  private _onSelectRow() {

    if (this._massSelection) {
      const rows: Array<any> = [];
      this._table._content.forEach((content) => {
        rows.push(content);
      });
      this.selectRows.emit({ _rows: rows});
    } else {
      this.selectRows.emit({ _rows: this._getSelectedRowsContent()});
    }

  }

  /***
   * This function is called when the user changes the pagination or
   * do the searching. It affects the values and emit
   * the config changes to all related components.
   */
  private _emitConfigChange() {
    this.configChange.emit(this._config);
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

        let tmpContent = this._table._content[rowKey][newColumnAttr[0]];

        newColumnAttr = newColumnAttr.splice(1);

        for (const i of newColumnAttr){
          tmpContent = tmpContent ? tmpContent[i] : '-';
        }

        return tmpContent || '';

      } else {

        if (this._table._content[rowKey] && this._table._content[rowKey][columnAttr]) {
          return this._table._content[rowKey][columnAttr];
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
   * @returns {string}
   */
  public getChoiceAlias(choice: Choice): string {
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

    this._onSelectRow();

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
   * This function returns if a column is sortable or not
   * @param {Column} column
   * @returns {boolean}
   */
  public isSortable(column: Column) {
    return column._isSortable;
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
    this._emitConfigChange();
  }

  get pagination(): Pagination {
    return this._pagination;
  }

  set pagination(value: Pagination) {
    this._pagination = value;
    this._config.limit = this._pagination.parPage.toString(10);
    this._config.offset = this._pagination.offset.toString(10);
    this._emitConfigChange();
  }

  get searchConfig(): Config {
    return this._config;
  }

  set searchConfig(value: Config) {
    this._config = value;
    this._emitConfigChange();
  }

  get config(): Config {
    return this._config;
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get userLang(): string {
    return this._translateService.currentLang;
  }

  get massSelection(): boolean {
    return this._massSelection;
  }

  get isSearching(): boolean {
    return this._isSearching;
  }

}
