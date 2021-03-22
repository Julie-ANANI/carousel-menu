import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Column, types } from '../../../table/models/column';
import { Choice } from '../../../table/models/choice';
import { Config } from '../../../../models/config';

@Component({
  selector: 'app-shared-search-filter',
  templateUrl: './shared-search-multi.component.html',
  styleUrls: ['./shared-search-multi.component.scss']
})

export class SharedSearchMultiComponent {

  @Input() set searchConfig(value: Config) {
    this._searchConfig = value;
  }

  @Input() set props(value: Column[]) {
    this._loadProps(value);
  }

  @Input() set tableView(value: boolean) {
    this._tableView = value;
  }

  @Output() searchConfigChange: EventEmitter<Config> = new EventEmitter<Config>();

  private _currentTextProp: Column = {_attrs: [''], _name: '', _type: 'TEXT'};

  private _textProps: Column[] = [];

  private _otherProps: Column[] = [];

  private _tableView: boolean;

  private _searchConfig: Config;

  private _searchString = '';

  private _openTooltip = false;

  constructor() {}

  private _loadProps(value: Column[]) {
    if (value) {
      this._textProps = value.filter(value1 =>
        (this.getType(value1) === 'TEXT' || this.getType(value1) === 'COUNTRY') && (this.isFiltrable(value1)));

      if (this._currentTextProp._attrs[0] === '' && this._textProps.length > 0) {
        this._currentTextProp = this._textProps[0];
      }

      this._otherProps = value.filter(value1 => this.getType(value1) === 'CHECK' || this.getType(value1) === 'MULTI-CHOICES');
    }

  }

  public textIsSelected(prop: Column): boolean {
    return this._currentTextProp._attrs[0] === prop._attrs[0];
  }

  public isFiltrable(column: Column): boolean {
    return column._isSearchable === undefined ? true : column._isSearchable;
  }

  public onChangeTextProp(prop: Event) {
    this._searchConfig.search = '{}';
    this._deleteAdvanceConfig(this._currentTextProp);
    this._currentTextProp = this._textProps.find(value => value._attrs[0] === (prop.target as HTMLSelectElement).value);
    if (this._searchString) {
      this.onSearch(false);
    }
  }

  /**
   * This function sets the search configuration up. The idea here is to put the right values
   * regarding the search string and the fields.
   * New: if in the configuration of the column the property _searchConfig exists, the configuration
   * object changes to perform an advanced search in the back.
   */
  public onSearch(toDelete = true) {
    this._searchConfig.offset = '0';

    if (toDelete) {
      this._deleteAdvanceConfig(this._currentTextProp);
    }

    if (this._searchString === '') {
      this._searchConfig.search = '{}';
    } else {
      const _search: any = {};

      const input = this._searchString.split(',');

      // See if we have some information for a complicated search
      if (this._currentTextProp._searchConfig) {
        // refactor the code.
        this._initAdvanceConfig(this._currentTextProp, 'TEXT', input);
      } else {
        input.forEach((queryStr: string, index: number) => {
          _search[this._currentTextProp._attrs[index]] = encodeURIComponent(queryStr.trim());
        });
        this._searchConfig.search = JSON.stringify(_search);
      }
    }

    this.searchConfigChange.emit(this._searchConfig);

  }

  /**
   *
   * @param value
   * @param type
   * @param searchString
   * @private
   */
  private _initAdvanceConfig(value: Column, type: 'TEXT' | 'CHOICE', searchString: any) {
    if (value._searchConfig) {
      this._searchConfig['fromCollection'] = value._searchConfig._collection;
      switch (type) {
        case 'TEXT':
          this._searchConfig[value._searchConfig._searchKey] = encodeURIComponent(searchString.join(' '));
          break;
        case 'CHOICE':
          this._searchConfig[value._searchConfig._searchKey] = searchString;
          break;
      }
    }
  }

  private _deleteAdvanceConfig(value: Column) {
    if (value._searchConfig) {
      delete this._searchConfig['fromCollection'];
      delete this._searchConfig[value._searchConfig._searchKey];
    }
  }

  /**
   *
   * @param prop
   */
  public onOtherSearch(prop: Column) {

    this._searchConfig.offset = '0';

    if (this._searchConfig[prop._attrs[0]] === null || this._searchConfig[prop._attrs[0]] === undefined ) {
      delete this._searchConfig[prop._attrs[0]];
      this._deleteAdvanceConfig(prop);
    }

    if (prop._searchConfig && prop._searchConfig._collection && this._isExistsSearchKey()) {
      this._searchConfig['fromCollection'] = prop._searchConfig._collection;
    } else if (this._searchString) {
      this.onSearch();
    }

    this.searchConfigChange.emit(this._searchConfig);

  }

  private _isExistsSearchKey(): boolean {
    if (this._otherProps.length) {
      for (let i = 0; i < this._otherProps.length; i++) {
        for (const property in this._searchConfig) {
          if (this._searchConfig.hasOwnProperty(property) && this._otherProps[i]._searchConfig) {
            if (this._otherProps[i]._searchConfig._searchKey === property) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  getType(column: Column): types {
    return column._type;
  }

  getAttrs(column: Column) {
    return column._attrs[0];
  }

  getName(column: Column) {
    return column._name;
  }

  getChoices(column: Column): Choice[] {
    return column._choices || [];
  }

  getChoiceName(choice: Choice): string {
    return choice._name;
  }

  getChoiceAlias(choice: Choice): string {
    return choice._alias || choice._name;
  }

  getTooltip(): string {
    return this.currentTextProp._searchTooltip || '';
  }

  get currentTextProp(): Column {
    return this._currentTextProp;
  }

  get textProps() {
    return this._textProps;
  }

  get otherProps() {
    return this._otherProps;
  }

  get tableView(): boolean {
    return this._tableView;
  }

  get searchConfig(): Config {
    return this._searchConfig;
  }

  get searchString(): string {
    return this._searchString;
  }

  set searchString(value: string) {
    this._searchString = value;
  }

  get openTooltip(): boolean {
    return this._openTooltip;
  }

  set openTooltip(value: boolean) {
    this._openTooltip = value;
  }

}
