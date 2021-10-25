import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Output } from '@angular/core';
import { Table } from '../models/table';
import { Row } from '../models/row';
import { Column, types } from '../models/column';
import { Choice } from '../models/choice';
import { TranslateService } from '@ngx-translate/core';
import { countries } from '../../../models/static-data/country';
import { Config } from '../../../models/config';
import { Pagination } from '../../utility/paginations/interfaces/pagination';
import { LocalStorageService } from '../../../services/localStorage/localStorage.service';
import { ConfigService } from '../../../services/config/config.service';

import * as moment from 'moment';
import * as momentTimeZone from 'moment-timezone';
import * as lodash from 'lodash';
import { DatePipe } from '@angular/common';
import { UserSuggestion } from '../../user/admin/components/admin-project/admin-project-settings/admin-project-settings.component';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

/**
 * editable cell
 */
interface InputGrid {
  index: number; // which row
  column: Column; // which column
  disabled: boolean; // input disabled?
  value: any; // content value
  input: any; // input ngModel,
  searchControl?: FormControl;
  suggestions?: Array<any>;
  sourceList?: Array<any>;
}

@Component({
  selector: 'app-shared-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {

  get tableContent(): Array<any> {
    return !!this._table._isLocal ? this._filteredContent : this._table._content;
  }

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
    this._selectedIndex = null;
    this._loadData(value);
  }

  /**
   * Try to stop loading :(
   * @param value
   */
  @Input() set loading(value: boolean) {
    this._isLoadingData = !!value;
  }

  constructor(@Inject(LOCALE_ID) private _locale: string,
              private _translateService: TranslateService,
              private _configService: ConfigService,
              private _localStorageService: LocalStorageService) {
    this._initializeTable();
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

    if (!this._table._isLocal) {
      this._emitConfigChange();
    }
  }

  get pagination(): Pagination {
    return this._pagination;
  }

  set pagination(value: Pagination) {
    this._pagination = value;
    if (this._massSelection || this._isRowSelected) {
      this._initializeContents();
    }
    this._initializeVariables();
    this._config.limit = this._pagination.parPage.toString(10);
    this._config.offset = this._pagination.offset.toString(10);

    if (this._table._isLocal) {
      this._setFilteredContent();
    } else {
      this._emitConfigChange();
    }
  }

  get searchConfig(): Config {
    return this._config;
  }

  set searchConfig(value: Config) {
    this._config = value;

    if (this._table._isLocal) {
      this._localStorageService.setItem('table-search', 'active');
      this._setFilteredContent();

      if (this._table._hasCustomFilters) {
        this.customFilter.emit({key: '', value: ''});
        for (const key of Object.keys(this._config)) {
          if (
            this._table._columns.find(
              (col) => col._isCustomFilter && col._attrs[0] === key
            )
          ) {
            this.customFilter.emit({key: key, value: this._config[key]});
          }
        }
      }
    } else {
      this._emitConfigChange();
    }
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

  get isLoadingData(): boolean {
    return this._isLoadingData;
  }

  get filteredContent(): Array<any> {
    return this._filteredContent;
  }

  get visibleColumns(): Array<Column> {
    return this._table._columns.filter((col) => {
      return !col._isHidden;
    });
  }

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  get isSelectAll(): boolean {
    return this._isSelectAll;
  }

  @Output() sendAddParentNavigator = new EventEmitter();

  private _originalTable: Table = <Table>{};

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

  /***
   * Output call when the user selects the item from the
   * dropdown list.
   * @type {EventEmitter<{content: any, item: Choice}>}
   */
  @Output() dropdownAction: EventEmitter<{
    content: any;
    item: Choice;
  }> = new EventEmitter<{ content: any; item: Choice }>();

  /***
   * output the custom filter value when changes in the Search bar.
   */
  @Output() customFilter: EventEmitter<{
    key: string;
    value: any;
  }> = new EventEmitter<{ key: string; value: any }>();

  @Output() sendEditNavigator = new EventEmitter();

  private _table: Table;

  /**
   * boolean: if all the data is selected(not the rows in table)
   * @private
   */
  private _isSelectAll = false;

  private _isSearching: boolean;

  private _massSelection: boolean;

  private _config: Config;

  private _pagination: Pagination;

  private _isLoadingData: boolean;

  private _filteredContent: Array<any> = [];

  private _selectedIndex: number = null;

  // get the string formed when column value is Array
  private _stringInArrayColumn = '';

  // copy an original table
  private _isOrginal = false;

  private _inputGrids: Array<InputGrid> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _isLoading = true;

  /**
   * it will be true when the single row is selected
   * so that at the change in pagination we can reinitialize all the
   * content.
   */
  private _isRowSelected = false;

  /***
   * This function returns if a rows is selected or not
   * @param content
   * @returns {boolean}
   */
  public static isSelected(content: any): boolean {
    return !!content && !!content._isSelected;
  }

  private static _getRowKey(key: string): number {
    return parseInt(key, 10);
  }

  ngOnInit(): void {
  }


  get isLoading(): boolean {
    return this._isLoading;
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
      _clickIndex: 1,
      _columns: [],
      _content: [],
    };
  }


  /***
   * This function load and initialise the data send by the user
   * @param {Table} data
   */
  private _loadData(data: Table): void {
    if (data) {
      this._table = data;
      this._initializeVariables();
      this._setPagination(Number(this._config.offset));
      this._checkSearching();

      if (this._table._isLocal) {
        this._setFilteredContent();
      }

      if (!this._isOrginal) {
        this._originalTable = JSON.parse(JSON.stringify(this._table));
        this._isOrginal = true;
      }

      this._initializeColumns();
      this._initializeContents();
    }
  }

  private _initializeVariables() {
    this._massSelection = false;
    this._isRowSelected = false;
    this._isSearching = false;
    this._isLoadingData = false;
  }

  /***
   * This function is called when the content is local. We slice the
   * rows passed to it based on the offset and parPage.
   * @param rows
   * @private
   */
  private _getFilteredContent(rows: Array<any>) {
    this._pagination.parPage = this._table._isPaginable
      ? parseInt(this._configService.configLimit(this._table._selector), 10) ||
      Number(this._config.limit) ||
      10
      : rows.length;

    this._table._total =
      this._table._total === -1 ? this._table._total : rows.length;

    if (this._pagination.offset >= this._table._total) {
      this._pagination.offset = 0;
      this._pagination.currentPage = 1;
    }

    const startIndex = this._pagination.offset;
    const endIndex = this._pagination.offset + this._pagination.parPage;

    this._isSearching = this._isSearching && this._table._total === 0;

    this._filteredContent = rows.slice(startIndex, endIndex);
  }

  /***
   * This function sets the pagination value.
   */
  private _setPagination(offset: number) {
    this._pagination = {
      propertyName: this._table._selector,
      offset: offset,
      currentPage:
        this._pagination && this._pagination.currentPage
          ? this._pagination.currentPage
          : 1,
      previousPage:
        this._pagination && this._pagination.previousPage
          ? this._pagination.previousPage
          : 0,
      nextPage:
        this._pagination && this._pagination.nextPage
          ? this._pagination.nextPage
          : 2,
    };
  }

  private _checkSearching() {
    if (this._config.search.length > 2 && this._table._total === 0) {
      this._isSearching = true;
    }
  }

  /*public getPopoverClass(row: string, column: Column) {
    if (!this.getContentValue(row, this.getAttrs(column)[0]).toString()) {
      return '';
    } else {
      if (row >= '0' && row <= '4') {
        return 'popover is-bottom';
      } else {
        return column._popoverPosition ? 'popover ' + column._popoverPosition : 'popover is-top';
      }
    }
  }*/

  /***
   * This function initialise the values of a column.
   */
  private _initializeColumns() {
    if (this._table._columns && this._table._columns.length) {
      this._table._columns.forEach((value, index) => {
        this._table._columns[index]._isSearchable = this._table._columns[index]
          ._isSearchable
          ? this._table._columns[index]._isSearchable
          : false;
        this._table._columns[index]._isSelected = this._columnActive(value);
      });
    }
  }

  /***
   * This function initialise the values of a content.
   */
  private _initializeContents() {
    if (this._table._isLocal) {
      this._filteredContent.forEach((value) => {
        value._isSelected = false;
      });
    } else {
      this._table._content.forEach((value) => {
        if (!value.hasOwnProperty('_isSelected')) {
          value._isSelected = false;
        }
      });
    }
  }

  private _columnActive(column: Column): boolean {
    let sortKey;
    if (typeof this._config.sort === 'string') {
      for (const key in JSON.parse(this._config.sort)) {
        if (JSON.parse(this._config.sort).hasOwnProperty(key)) {
          sortKey = key;
        }
      }
    }
    return this.getAttrs(column).indexOf(sortKey) !== -1;
  }

  /***
   * This function returns the number of selected rows
   * @returns {number}
   */
  private _getSelectedRowsNumber(): number {
    if (this._massSelection) {
      if (this._table._isLocal) {
        return this._filteredContent.filter((_content) => {
          return !this.disabledRow(_content);
        }).length;
      } else {
        return this._table._content.filter((_content) => {
          return !this.disabledRow(_content);
        }).length;
      }
    } else {
      return this.getSelectedRows().length;
    }
  }

  /***
   * This function allows to select all the rows.
   * only select those who are not disabled.
   * @param event
   */
  public selectAll(event: Event): void {
    event.preventDefault();
    this._isSelectAll = false;
    this._isRowSelected = false;

    if (this._table._isLocal) {
      this._filteredContent.forEach((value) => {
        if (!this.disabledRow(value)) {
          value._isSelected = (event.target as HTMLInputElement).checked;
        }
      });
    } else {
      this._table._content.forEach((value) => {
        if (!this.disabledRow(value)) {
          value._isSelected = (event.target as HTMLInputElement).checked;
        }
      });
    }

    this._massSelection = (event.target as HTMLInputElement).checked;
    this._onSelectRow();
  }

  /***
   * This function is called when the users either select the one row
   * or select all on the basis of that we emit the selected rows to the
   * parent component.
   */
  private _onSelectRow() {
    if (this._massSelection) {
      this.selectRows.emit({_rows: this._getAllContent()});
    } else {
      this.selectRows.emit({_rows: this._getSelectedRowsContent()});
    }
  }

  /***
   * This function is called when the user changes the pagination or
   * do the searching. It affects the values and emit
   * the config changes to all related components.
   */
  private _emitConfigChange() {
    this._isLoadingData = true;
    this.configChange.emit(this._config);
  }

  /***
   * This function is call when the user click on the click name
   * Emit the Output editRow
   * @param {Row} row
   * @param selectIndex
   */
  public edit(row: Row, selectIndex: number) {
    this.editRow.emit(row);
    this._selectedIndex = selectIndex;
  }

  /***
   * This function is call when the user click on the delete button
   * Emit the Output removeRows
   */
  public removeSelectedRows() {
    if (this._massSelection) {
      this.removeRows.emit(this._getAllContent());
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
      this.performAction.emit({
        _action: action,
        _rows: this._getAllContent(),
      });
    } else {
      this.performAction.emit({
        _action: action,
        _rows: this._getSelectedRowsContent(),
      });
    }
  }

  /***
   * This function returns the keys of the table
   * @returns {string[]}
   */
  public getRowsKeys(): Array<string> {
    if (this._table._isLocal) {
      return Object.keys(this._filteredContent);
    } else {
      return Object.keys(this._table._content);
    }
  }

  /***
   * This function returns the content of the column basing on the rowKey
   * and the column(s) attribute(s)
   * @param {string} rowKey
   * @param {string} columnAttr
   * @returns {string}
   */
  public getContentValue(rowKey: string, columnAttr: string): any {
    const row: number = TableComponent._getRowKey(rowKey);
    const contents: Array<any> = this._table._isLocal ? this._filteredContent : this._table._content;

    if (contents.length > 0) {
      if (columnAttr.split('.').length > 1) {
        let newColumnAttr = columnAttr.split('.');
        let tmpContent = contents[row] ? contents[row][newColumnAttr[0]] : '';
        newColumnAttr = newColumnAttr.splice(1);
        for (const i of newColumnAttr) {
          tmpContent = tmpContent ? tmpContent[i] : '-';
        }
        return tmpContent || '';
      } else {
        if (contents[row] && contents[row][columnAttr]) {
          return contents[row][columnAttr];
        }
      }
      return '';
    }
  }

  /**
   * Gte the title of a grid
   * @param row
   * @param column
   */
  public getTitle(row: string, column: Column) {
    const title = this.getAttrs(column)
      .map((attr) => {
        return (this.getContentValue(row, attr) || ' - ').toString();
      })
      .join(' ');
    if (title.length > 20) {
      return title;
    } else {
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

  /**
   * This function returns the attribute(s) of the column
   * @param column
   */
  public getIsReplace(column: Column) {
    return column._isReplaceable;
  }

  /**
   * This function returns the attribute(s) of the column
   * @param column
   */
  public getIsFilled(column: Column) {
    return column._isFilled;
  }

  /***
   * This function returns the disabled state of the column
   * @param {Column} column
   * @returns {string[]}
   */
  public getDisabledState(column: Column) {
    return column._disabledState;
  }

  /***
   * This function returns the index of one attribute of a column
   * @param {Column} column
   * @param {string} attr
   * @returns {number}
   */
  public getAttrIndex(column: Column, attr: string) {
    return this.getAttrs(column).findIndex((value) => value === attr);
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
    return (
      this.getChoices(column).find((value) => value._name === name) || {
        _name: '',
        _class: '',
      }
    );
  }

  /***
   * This function return the alias of a choice that will be show to the user instead of the initial name
   * @param {Choice} choice
   * @returns {any}
   */
  public getChoiceAlias(choice: Choice): any {
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
   * This function returns the label corresponding to a choice
   * @param {Choice} choice
   * @returns {string}
   */
  public getChoiceDisabledClass(choice: Choice): string {
    return choice._disabledClass || '';
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
    return column._multiLabels.find((value) => value._attr === attr) || {};
  }

  /***
   * This function returns the class of one label of a multilabel
   * @param multiLabel
   */
  public getMultiLabelClass(multiLabel: any): string {
    return multiLabel._class;
  }

  /***
   * This function returns the length.
   */
  public getLength(content: string): string {
    return content.length.toString(10) || '-';
  }

  /***
   * This function returns all the selected rows
   * @returns {Row[]}
   */
  public getSelectedRows(): Row[] {
    if (this._table._isLocal) {
      return this._filteredContent.filter(
        (content) => content._isSelected === true
      );
    } else {
      return this._table._content.filter(
        (content) => content._isSelected === true
      );
    }
  }

  /***
   * This function returns the content of the selected rows
   * @returns {any[]}
   */
  private _getSelectedRowsContent(): any[] {
    const content: any[] = [];
    this.getSelectedRows().forEach((value) => content.push(value));
    return content;
  }

  /***
   * This function change the selected value of a row to the opposite
   * @param {string} key
   */
  public selectRow(key: string): void {
    const rowKey: number = TableComponent._getRowKey(key);
    this._isSelectAll = false;

    if (this._table._isSelectable) {
      if (this._table._isLocal) {
        this._filteredContent[rowKey]._isSelected = !this._filteredContent[rowKey]._isSelected;
      } else {
        this._table._content[rowKey]._isSelected = !this._table._content[rowKey]._isSelected;
      }
      this._isRowSelected = true;
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
    const index = this._table._columns.findIndex(
      (value) => value._name === key
    );
    this._table._columns[index]._isSelected = true;
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
   * This function returns if a column has a tooltip or not
   * @param {Column} column
   * @returns {boolean}
   */
  public hasTooltip(column: Column) {
    return column._tooltip;
  }


  /**
   * This function counts the number of days/months/years to some future date.
   * The format of the column must be like this:
   *    columnName-days
   * for example: createdAt-90 will take the value at the column 'createdAt' (which
   * should be a valid date) and count the number of days to arrive to 90 days.
   * @param row
   * @param key
   */
  public countDaysTo(row: any, key: string) {
    const _skey = key.split('-');
    const _time = _skey.length > 1 ? _skey[1] : 0;
    const _key: string = _skey[0];
    const value = moment(this.getContentValue(row, _key));
    return value.add(_time, 'days').fromNow();
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
    if (isoCode) {
      isoCode = isoCode === 'UK' ? 'GB' : isoCode;
      return countries[isoCode] || 'NA';
    } else {
      return 'NA';
    }
  }

  /**
   * only push those rows who are selected.
   * @private
   */
  private _getAllContent(): Array<any> {
    const rows: Array<any> = [];

    if (this._table._isLocal) {
      this._filteredContent.forEach((content) => {
        if (content._isSelected) {
          rows.push(content);
        }
      });
    } else {
      this._table._content.forEach((content) => {
        if (content._isSelected) {
          rows.push(content);
        }
      });
    }

    return rows;
  }

  /***
   * When changing the pagination we check if we have activated the
   * search or not.
   * @private
   */
  private _setFilteredContent() {
    if (this._localStorageService.getItem('table-search') === 'active') {
      this._isSearching = true;
      this._isLoadingData = true;
      this._getFilteredContent(this._searchLocally());
      setTimeout(() => {
        this._isLoadingData = false;
      }, 200);
    } else {
      this._getFilteredContent(this._table._content);
    }
  }

  public disabledRow(content: any): boolean {
    return this._table._isRowDisabled && this._table._isRowDisabled(content);
  }

  public onClickDropdownItem(content: any, item: Choice) {
    this.dropdownAction.emit({content: content, item: item});
  }

  public getTime(content: string): string {
    return momentTimeZone(content).tz('Europe/Paris').format('h:mm a');
  }

  private _searchLocally(): Array<any> {
    let rows: Array<any> = this._table._content;
    this._localStorageService.setItem('table-search', '');

    for (const configKey of Object.keys(this._config)) {
      if (
        this._table._columns.find((column) => column._attrs[0] === configKey) ||
        this._config.search.length > 2
      ) {
        if (this._config.search.length > 2) {
          for (const searchKey of Object.keys(JSON.parse(this._config.search))) {
            const searchValue = JSON.parse(this._config.search)[searchKey];
            rows = this._searchContent(
              rows,
              searchKey,
              searchValue.toString().toLowerCase()
            );
          }
        }

        if (
          this._table._columns.find((column) => column._attrs[0] === configKey)
        ) {
          const searchValue = this._config[configKey];
          rows = this._searchContent(
            rows,
            configKey,
            searchValue.toLowerCase()
          );
        }

        this._localStorageService.setItem('table-search', 'active');
      }
    }

    return rows;
  }

  private _searchContent(
    totalContents: Array<any>,
    searchKey: string,
    searchValue: string
  ): Array<any> {
    return totalContents.filter((content) => {
      if (searchKey === 'country') {
        searchKey = 'country.flag';
      }

      for (const contentKey of Object.keys(content)) {
        if (searchKey.split('.').length > 1) {
          let newAttr = searchKey.split('.');

          if (contentKey === newAttr[0]) {
            let tmpContent = content[newAttr[0]];
            newAttr = newAttr.splice(1);

            for (const i of newAttr) {
              tmpContent = tmpContent ? tmpContent[i] : '-';
            }

            if (
              tmpContent &&
              tmpContent.toString().toLowerCase().indexOf(searchValue) !== -1
            ) {
              return true;
            }
          }
        } else if (
          contentKey === searchKey &&
          searchValue &&
          content[searchKey] &&
          content[searchKey].toString().toLowerCase() ===
          searchValue.toLowerCase()
        ) {
          return true;
        }
      }

      return false;
    });
  }

  public getContext(row: any, column: any) {
    return {
      row: row,
      column: column,
    };
  }

  /**
   * array in colimn
   * @param row
   * @param column
   * @param label
   */
  public getStringForColumn(row: any, column: any, label: string) {
    this._stringInArrayColumn = '';
    const temList = this.getContentValue(row, this.getAttrs(column)[0]);
    if (temList) {
      temList.map((item: any, index: any) => {
        if (index === temList.length - 1) {
          this._stringInArrayColumn = this._stringInArrayColumn.concat(
            item[label]
          );
        } else {
          this._stringInArrayColumn = this._stringInArrayColumn.concat(
            item[label] + ', '
          );
        }
      });
    }
    return this._stringInArrayColumn;
  }

  /**
   * when table in addParent/bulkEdit
   * for each value: verify if we should add the color or not
   * @param index
   * @param column
   */
  public getTextColor(index: any, column: Column) {
    if (this.isToAddColor(column)) {
      if (
        lodash.isEqual(
          this._table._content[index][column._attrs[0]],
          this._originalTable._content[index][column._attrs[0]]
        )
      ) {
        return null;
      } else {
        return {
          color: column._color,
        };
      }
    }
  }

  isToAddColor(column: Column) {
    return (
      (column.hasOwnProperty('_isFilled') ||
        column.hasOwnProperty('_isReplaceable')) &&
      (column['_isFilled'] === true || column._isReplaceable === true)
    );
  }

  getPerformedAction(action: string, context: any) {
    this.performAction.emit({_action: action, _context: context});
  }

  /**
   * select those columns who are not disabled.
   */
  public selectAllTheData() {
    this._isSelectAll = true;
    this._isRowSelected = false;

    if (this._table._isLocal) {
      this._filteredContent.forEach((value) => {
        if (!this.disabledRow(value)) {
          value._isSelected = true;
        }
      });
    } else {
      this._table._content.forEach((value) => {
        if (!this.disabledRow(value)) {
          value._isSelected = true;
        }
      });
    }
    this.performAction.emit({_action: 'Select all', _context: true});
  }

  /**
   * clear the selection for not disabled rows.
   */
  public clearAllTheSelections() {
    this._isSelectAll = false;
    this._table._content.forEach((value) => {
      if (!this.disabledRow(value)) {
        value._isSelected = false;
      }
    });
    this.performAction.emit({_action: 'Select all', _context: false});
  }

  performFilters(event: any) {
    if (event) {
      this.performAction.emit({_action: 'Filter'});
    }
  }

  /**
   * click to edit
   * @param event
   * @param row
   * @param column
   */
  enableInput(event: Event, row: any, column: Column) {
    event.preventDefault();
    const gridInput = this._inputGrids.find(grid => grid.index === row && grid.column._attrs === column._attrs);
    if (gridInput) {
      gridInput.disabled = false;
    }
    if (gridInput.searchControl) {
      gridInput.searchControl.enable();
    }
  }

  /**
   * for one cell, get object
   * @param row
   * @param column
   */
  getInputGrid(row: any, column: Column) {
    if (column._isEditable) {
      const gridInputToAdd: InputGrid = {
        index: row,
        disabled: true,
        column: column,
        value: this._table._content[row],
        input: '',
      };
      switch (column._editType) {
        case 'DATE':
          if (this.getContentValue(row, column._attrs[0])) {
            gridInputToAdd.input = new DatePipe(this._locale)
              .transform(new Date(this.getContentValue(row, column._attrs[0])), 'yyyy-MM-dd');
          } else {
            gridInputToAdd.input = '-';
          }
          break;
        case 'MULTI-CHOICES':
          gridInputToAdd.input = this.getChoiceAlias(this.getChoice(column, this.getContentValue(row, this.getAttrs(column)[0])));
          break;
        case 'USER-INPUT':
          let name = '';
          for (const _attr of column._attrs) {
            name += this.getContentValue(row, _attr) + ' ';
          }
          gridInputToAdd.input = {name: name};
          break;
        case 'MULTI-INPUT':
          gridInputToAdd.sourceList = column._multiInput.sourceList || [];
          switch (column._type) {
            case 'LABEL-OBJECT-LIST':
              gridInputToAdd.input = this.getStringForColumn(row, column, column._label);
              break;
            default:
              gridInputToAdd.input = this.getContentValue(row, column._attrs[0]).toString();
          }

          gridInputToAdd.searchControl = new FormControl({
            value: gridInputToAdd.input ? gridInputToAdd.input + ',' : '',
            disabled: true
          });
          this.multiInputOnChange(gridInputToAdd);
          break;
        default:
          gridInputToAdd.input = this.getContentValue(row, column._attrs[0]);
          break;
      }
      if (!this._inputGrids.find(grid => grid.index === row && grid.column._attrs === column._attrs)) {
        this._inputGrids.push(gridInputToAdd);
      }
      return this._inputGrids.find(grid => grid.index === row && grid.column._attrs === column._attrs);
    }
  }

  /**
   * multiple input
   * @param gridInputToAdd
   */
  multiInputOnChange(gridInputToAdd: InputGrid) {
    gridInputToAdd.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this._ngUnsubscribe))
      .subscribe((input: any) => {
        if (input) {
          const inputSplit = input.split(',');
          let lastSearchKeyWord = inputSplit[inputSplit.length - 1];
          // trim spaces
          if (!lastSearchKeyWord.match(/^[ ]*$/)) {
            lastSearchKeyWord = lastSearchKeyWord.replace(/\s/g, '');
            gridInputToAdd.suggestions = gridInputToAdd.sourceList.filter((value: string) =>
              value.replace(/\s/g, '').toLowerCase().indexOf(lastSearchKeyWord.toLowerCase()) !== -1 ||
              lastSearchKeyWord.toLowerCase().indexOf(value.replace(/\s/g, '').toLowerCase()) !== -1
            );
          } else {
            gridInputToAdd.suggestions = [];
          }
        }
      });
  }

  /**
   * validate input => send values
   * @param event
   * @param row
   * @param column
   */
  sendEditedGrid(event: Event, row: any, column: Column) {
    event.preventDefault();
    const _dataToUpdate = this._inputGrids.find(grid => grid.index === row && grid.column._attrs === column._attrs);
    if (_dataToUpdate) {
      const _attrs = column._attrs.toString().split('.');
      switch (column._editType) {
        case 'MULTI-CHOICES':
          const choiceItem = column._choices.find(item => item._alias.toLowerCase() === _dataToUpdate.input.toLowerCase());
          if (choiceItem) {
            lodash.set(_dataToUpdate.value, _attrs, choiceItem._name);
          }
          _dataToUpdate.input = choiceItem._name;
          break;
        case 'MULTI-INPUT':
          const valueToReplace: any[] = [];
          let valueList: any[] = [];
          let newEle = {};
          if (_dataToUpdate.searchControl.value) {
            valueList = _dataToUpdate.searchControl.value.split(',');
          }
          // check if the list should be a list of object
          // property: key of the object
          if (valueList && valueList.length) {
            valueList.map(value => {
              if (column._multiInput.property && column._multiInput.property.length) {
                newEle = {};
                for (let i = 0; i < column._multiInput.property.length; i++) {
                  newEle[column._multiInput.property[i]] = value;
                }
                valueToReplace.push(newEle);
              } else {
                valueToReplace.push(value);
              }
            });
          }
          _dataToUpdate.input = _dataToUpdate.searchControl.value;
          _dataToUpdate.searchControl.disable();
          lodash.set(_dataToUpdate.value, _attrs, valueToReplace);
          break;
        default:
          lodash.set(_dataToUpdate.value, _attrs, _dataToUpdate.input);
          break;
      }
      this.performAction.emit({
        _action: 'Update grid',
        _context: _dataToUpdate.value,
        _value: _dataToUpdate.input,
        _column: column
      });
      _dataToUpdate.disabled = true;
    }
  }

  /**
   * cancel edit in table => reset original value
   * @param event
   * @param row
   * @param column
   */
  cancelEditedGrid(event: Event, row: any, column: Column) {
    event.preventDefault();
    const _dataToUpdate = this._inputGrids.find(grid => grid.index === row && grid.column._attrs === column._attrs);
    if (_dataToUpdate) {
      switch (column._editType) {
        case 'DATE':
          if (this.getContentValue(row, column._attrs[0])) {
            _dataToUpdate.input = new DatePipe(this._locale).transform(new Date(this.getContentValue(row, column._attrs[0])), 'yyyy-MM-dd');
          } else {
            _dataToUpdate.input = '-';
          }
          break;
        case 'MULTI-CHOICES':
          _dataToUpdate.input = this.getChoiceAlias(this.getChoice(column, this.getContentValue(row, this.getAttrs(column)[0])));
          break;
        case 'USER-INPUT':
          let name = '';
          for (const _attr of column._attrs) {
            name += this.getContentValue(row, _attr) + ' ';
          }
          _dataToUpdate.input = {name: name};
          break;
        case 'MULTI-INPUT':
          switch (column._type) {
            case 'LABEL-OBJECT-LIST':
              _dataToUpdate.input = this.getStringForColumn(row, column, column._label);
              break;
            default:
              _dataToUpdate.input = this.getContentValue(row, column._attrs[0]);
          }
          _dataToUpdate.searchControl.disable();
          break;
        default:
          _dataToUpdate.input = this.getContentValue(row, column._attrs[0]);
          break;
      }
      _dataToUpdate.disabled = true;
    }
  }

  /**
   * User input
   * When user select from users list
   * @param value
   * @param row
   * @param column
   */
  getUserSelected(value: UserSuggestion, row: any, column: Column) {
    const _dataToUpdate = this._inputGrids.find(grid => grid.index === row && grid.column._attrs === column._attrs);
    if (_dataToUpdate && value && value._id) {
      _dataToUpdate.input = value;
    }
  }

  /**
   * Multiple input
   * when user select from suggestion list
   * @param suggestion
   * @param row
   * @param column
   */
  onValueSelect(suggestion: string, row: any, column: Column) {
    const gridToUpdate = this._inputGrids.find(grid => grid.index === row && grid.column._attrs === column._attrs);
    const splits = gridToUpdate.searchControl.value.split(',');
    splits[splits.length - 1] = suggestion;
    gridToUpdate.searchControl.patchValue(splits.toString() + ',');
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
