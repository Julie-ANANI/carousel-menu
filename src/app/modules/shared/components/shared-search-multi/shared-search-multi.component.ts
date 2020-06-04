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

  private _searchString: string = '';

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

    this._currentTextProp = this._textProps.find(value => value._attrs[0] === (prop.target as HTMLSelectElement).value);

    if (this._searchString) {
      this.onSearch();
    }

  }

  /**
   * This function sets the search configuration up. The idea here is to put the right values
   * regarding the search string and the fields.
   * New: if in the configuration of the column the property _searchConfig exists, the configuration
   * object changes to perform an advanced search in the back.
   */
  public onSearch() {

    this._searchConfig.offset = '0';

    if (this._searchString === '') {
      this._searchConfig.search = '{}';
      if (this._currentTextProp._searchConfig) {
        delete this._searchConfig['fromCollection'];
        delete this._searchConfig[this._currentTextProp._searchConfig._searchKey];
      }
    } else {
      const _search: any = {};

      const input = this._searchString.split(',');

      // See if we have some information for a complicated search
      if (this._currentTextProp._searchConfig) {
        this._searchConfig['fromCollection'] = this._currentTextProp._searchConfig._collection;
        this._searchConfig[this._currentTextProp._searchConfig._searchKey] = encodeURIComponent(input.join(' '));
      } else {
        input.forEach((queryStr: string, index: number) => {
          _search[this._currentTextProp._attrs[index]] = encodeURIComponent(queryStr.trim());
        });
        this._searchConfig.search = JSON.stringify(_search);
      }
    }

    this.searchConfigChange.emit(this._searchConfig);

  }

  public onOtherSearch(prop: Column) {

    this._searchConfig.offset = '0';

    if (this._searchConfig[prop._attrs[0]] === null || this._searchConfig[prop._attrs[0]] === undefined ) {
      delete this._searchConfig[prop._attrs[0]];
    }

    this.searchConfigChange.emit(this._searchConfig);

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

}
