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
    return column._isFiltrable === undefined ? true : column._isFiltrable;
  }

  public onChangeTextProp(prop: any) {
    this._currentTextProp = this._textProps.find(value => value._attrs[0] === prop.target['value']);
  }

  // For values linked with config
  public onSearch(value: any) {

    this._searchConfig.offset = '0';

    let input = value.value || '';

      if (input === '') {
        this._searchConfig.search = '{}';
        this.searchConfigChange.emit(this._searchConfig);
      } else {
        //Detect an "special" query...
        input = input.split(',');
        let _search = {};

        input.forEach((queryStr, index) => {
          _search[this._currentTextProp._attrs[index]] = encodeURIComponent(queryStr.trim());
        });

        this._searchConfig.search = JSON.stringify(_search);
        this.searchConfigChange.emit(this._searchConfig);

      }

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

}
