import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Config} from '../../../../models/config';
import {Column, types} from '../../models/column';
import {picto} from '../../../../models/static-data/picto';
import {Choice} from '../../models/choice';

@Component({
  selector: 'app-table-search-filter',
  templateUrl: './table-search-filter.component.html',
  styleUrls: ['./table-search-filter.component.scss']
})
export class TableSearchFilterComponent {

  /**
   *
   * @param value
   */
  @Input() set searchConfig(value: Config) {
    this._initSearch(value);
  }

  /**
   *
   * @param value
   */
  @Input() set properties(value: Array<Column>) {
    this._initProperties(value);
  }

  @Output() searchConfigChange: EventEmitter<Config> = new EventEmitter<Config>();

  /***
   * will contain the columns of
   * type = 'TEXT' | 'COUNTRY'.
   */
  private _textProperties: Array<Column> = [];

  /***
   * will contain the columns of
   * type = 'CHECK' | 'MULTI_CHOICES'.
   */
  private _otherProperties: Array<Column> = [];

  /**
   * store the value of the search by dropdown.
   * @private
   */
  private _currentTextProperty: Column = {_attrs: [''], _name: '', _type: 'TEXT'};

  private _searchString = '';

  private _searchPicto = picto.search.meta;

  private _isFilterActive = false;

  private _searchConfig: Config = <Config> {};

  private _originalConfig: Config = <Config>{};

  /**
   * assign with searchConfig.search.
   */
  private _searchObject: any = {};

  /**
   * assign with searchConfig.advanceSearch.
   */
  private _advanceSearchObject: any = {};

  /**
   * using it for variable isFilterActive or to check object contains any property
   * or not.
   * @param value - searchObject or advanceSearchObject
   * @private
   */
  private static _iterateObject(value: object) {
    for (const property in value) {
      if (value.hasOwnProperty(property) && value[property]) {
        return true;
      }
    }
  }

  constructor() { }

  /**
   *
   * @param config
   * @private
   */
  private _initSearch(config: Config) {
    this._searchConfig = config;
    this._searchObject = typeof this._searchConfig.search === 'string'
      ? JSON.parse(this._searchConfig.search) : this._searchConfig.search;

    if (this._searchConfig.advanceSearch) {
      this._advanceSearchObject = typeof this._searchConfig.advanceSearch === 'string'
        ? JSON.parse(this._searchConfig.advanceSearch) : this._searchConfig.advanceSearch;
    }

    if (!this._isFilterActive) {
      this._checkFilterActive();
    }

    if (!this._originalConfig.search) {
      this._originalConfig = JSON.parse(JSON.stringify(config));
    }
  }

  /**
   * checking any filter is passed in the search or advanceSearch object or searchString.
   * @private
   */
  private _checkFilterActive() {
    this._isFilterActive = (!!this._searchString) || !!(TableSearchFilterComponent._iterateObject(this._searchObject))
      || !!(TableSearchFilterComponent._iterateObject(this._advanceSearchObject));
  }

  /**
   *  by default we initialize the this._currentTextProperty with this._textProperties[0].
   * @param columns
   * @private
   */
  private _initProperties(columns: Array<Column> = []) {
    if (columns.length) {
      this._textProperties = columns.filter((column) =>
        (this.type(column) === 'TEXT' || this.type(column) === 'COUNTRY') && this.isSearchable(column)
      );

      if (this._currentTextProperty._attrs[0] === '' && this._textProperties.length > 0) {
        this._currentTextProperty = this._textProperties[0];
      }

      this._otherProperties = columns.filter(column =>
        (this.type(column) === 'CHECK' || this.type(column) === 'MULTI-CHOICES') && this.isSearchable(column)
      );
    }
  }

  /**
   *
   * @param column
   */
  public isSearchable(column: Column): boolean {
    return column._isSearchable === undefined ? true : column._isSearchable;
  }

  /**
   *
   * @param column
   */
  public isTextSelected(column: Column): boolean {
    return this._currentTextProperty._attrs[0] === this.attrs(column);
  }

  /**
   * when there is change in the 'search by' dropdown.
   * first we delete the existing property from the this._searchObject or this._advanceSearchObject
   * based on the this._currentTextProperty and then we resign the value to this._currentTextProperty.
   * @param event
   */
  public onChangeTextProp(event: Event) {
    this._deleteProperty(this._currentTextProperty);
    this._currentTextProperty = this._textProperties.find(column =>
      this.attrs(column) === (event.target as HTMLSelectElement).value
    );
    if (this._searchString) {
      this.onSearchText(false);
    }
  }

  /**
   * delete the property from both the object this._searchObject and this._advanceSearchObject
   * based on the column.
   * @private
   * @param column
   */
  private _deleteProperty(column: Column) {
    if (this._searchObject[this.attrs(column)]) {
      delete this._searchObject[this.attrs(column)];
    }
    if (column._searchAdvance) {
      this._deleteAdvanceSearch(column);
    }
  }

  /**
   *
   * @param column
   * @private
   */
  private _deleteAdvanceSearch(column: Column) {
    this._iterateAdvance(column, 'DELETE');
  }

  /**
   * DELETE:
   * we iterate through the this._advanceSearchObject[column._searchAdvance._collection] and find the
   * property inside it to delete same as column._searchAdvance._searchKey and then we see if the
   * length of the this._advanceSearchObject[column._searchAdvance._collection] === 0 then
   * we remove that property from the this._advanceSearchObject.
   *
   * VALUE:
   * to select the value for the dropdown
   * @param column
   * @param type - DELETE | VALUE
   * @private
   */
  private _iterateAdvance(column: Column, type: 'DELETE' | 'VALUE') {
    const _collections: Array<object> = column._searchAdvance && column._searchAdvance._collection
      && this._advanceSearchObject[column._searchAdvance._collection] || [];
    let _value = '';

    if (_collections.length) {
      _collections.forEach((collection: object, index: number) => {

        for (const property in collection) {
          if (collection.hasOwnProperty(property) && property === column._searchAdvance._searchKey) {
            if (type === 'DELETE') {
              _collections.splice(index, 1);
            }
            if (type === 'VALUE') {
              _value = collection[property];
            }
          }
        }

        if (type === 'DELETE') {
          if (_collections.length === 0) {
            delete this._advanceSearchObject[column._searchAdvance._collection];
          }
        }
      });
    }

    if (type === 'VALUE') {
      return _value;
    }
  }

  /**
   *
   * @param column
   * @param value
   * @private
   */
  private _initAdvanceSearch(column: Column, value: string) {
    if (!this._advanceSearchObject[column._searchAdvance._collection]) {
      this._advanceSearchObject[column._searchAdvance._collection] = [];
    }
    this._advanceSearchObject[column._searchAdvance._collection].push({
      [column._searchAdvance._searchKey]: value
    });
  }

  /**
   * will be executed when the user press the enter or change searchBy dropdown or click cross
   * or search icon.
   * @param toDelete - passing false when changing the search by dropdown because already deleted.
   */
  public onSearchText(toDelete = true) {
    if (toDelete) {
      this._deleteProperty(this._currentTextProperty);
    }

    if (this._searchString !== '') {
      if (this._currentTextProperty._searchAdvance && this._currentTextProperty._searchAdvance._collection) {
        this._initAdvanceSearch(this._currentTextProperty, this._searchString);
      } else {
        const _input = this._searchString.split(',');
        _input.forEach((queryStr: string, index: number) => {
          this._searchObject[this._currentTextProperty._attrs[index]] = encodeURIComponent(queryStr.trim());
        });
      }
      this._isFilterActive = true;
    }

    this._emit();
  }

  /**
   *
   * @private
   */
  private _emit() {
    this._searchConfig.offset = '0';
    this._searchConfig.search = JSON.stringify(this._searchObject);
    if (TableSearchFilterComponent._iterateObject(this._advanceSearchObject)) {
      this._searchConfig.advanceSearch = JSON.stringify(this._advanceSearchObject);
    }
    this.searchConfigChange.emit(this._searchConfig);
  }

  /**
   * will be executed when there is change in the other properties
   * @param value - for the choice it is _name
   * @param column
   */
  public onSearchOther(value: string, column: Column) {
    this._deleteProperty(column);

    if (column._searchAdvance && column._searchAdvance._collection) {
      this._initAdvanceSearch(column, value);
    } else {
      this._searchObject[this.attrs(column)] = value;
    }

    this._emit();
  }

  /**
   * resetting all the filters.
   * @param event
   */
  public resetFilters(event: Event) {
    event.preventDefault();
    this._isFilterActive = false;
    this._searchConfig = this._originalConfig;
    this.searchConfigChange.emit(this._searchConfig);
  }

  public dropdownOtherPropValue(column: Column): string {
    if (column._searchAdvance && column._searchAdvance._collection) {
      if (TableSearchFilterComponent._iterateObject(this._advanceSearchObject)) {
        return this._iterateAdvance(column, 'VALUE') || undefined;
      }
    } else {
       return this._searchObject[this.attrs(column)];
    }
  }

  /**
   *
   * @param column
   */
  public type(column: Column): types {
    return column._type;
  }

  /**
   *
   * @param column
   */
  public name(column: Column) {
    return column._name;
  }

  /**
   *
   * @param column
   */
  public attrs(column: Column) {
    return column._attrs[0];
  }

  /**
   *
   * @param column
   */
  public choices(column: Column): Choice[] {
    return column._choices || [];
  }

  /**
   *
   * @param choice
   */
  public choiceName(choice: Choice): string {
    return choice._name;
  }

  /**
   *
   * @param choice
   */
  public choiceAlias(choice: Choice): string {
    return choice._alias || choice._name;
  }

  get tooltip(): string {
    return this._currentTextProperty._searchTooltip || '';
  }

  get textProperties(): Array<Column> {
    return this._textProperties;
  }

  get otherProperties(): Array<Column> {
    return this._otherProperties;
  }

  get searchString(): string {
    return this._searchString;
  }

  set searchString(value: string) {
    this._searchString = value;
  }

  get searchPicto(): string {
    return this._searchPicto;
  }

  get searchConfig(): Config {
    return this._searchConfig;
  }

  get isFilterActive(): boolean {
    return this._isFilterActive;
  }

}
