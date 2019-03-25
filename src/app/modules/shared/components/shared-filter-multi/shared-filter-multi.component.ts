import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Column, types } from '../../../table/models/column';
import { Choice } from '../../../table/models/choice';

@Component({
  selector: 'app-shared-multi-filter',
  templateUrl: './shared-filter-multi.component.html',
  styleUrls: ['./shared-filter-multi.component.scss']
})

export class SharedFilterMultiComponent {

  @Input() config: any;

  @Input() set props(value: Column[]) {
    this.loadProps(value);
  }

  @Output() configChange = new EventEmitter <any>();

  private _currentTextProp: Column = {_attrs: [''], _name: '', _type: 'TEXT'};

  private _textProps: Column[] = [];

  private _otherProps: Column[] = [];

  constructor() {}

  // For values linked with config
  filterText(event: any) {
    this.config.offset = '0';
    let value = event.value || '';
      if (value === '') {
        this.config.search = '{}';
        this.configChange.emit(this.config);
      } else {
        //Detect an "special" query...
        value = value.split(',');
        let _search = {};
        value.forEach((queryStr, idx)=>{
          _search[this._currentTextProp._attrs[idx]] = encodeURIComponent(queryStr.trim());
        });
        this.config.search = JSON.stringify(_search);
        this.configChange.emit(this.config);
      }
  }

  filterOther(prop: Column) {
    this.config.offset = 0;
    if (this.config[prop._attrs[0]] === null) {
        delete this.config[prop._attrs[0]];
    }
    this.configChange.emit(this.config);
  }

  textIsSelected(prop: Column): boolean {
    return this._currentTextProp._attrs[0] === prop._attrs[0];
  }

  loadProps(value: Column[]) {
    if (value) {
      this._textProps = value.filter(value1 =>
        (this.getType(value1) === 'TEXT' || this.getType(value1) === 'COUNTRY') && (this.isFiltrable(value1)));

      if (this._currentTextProp._attrs[0] === '' && this._textProps.length > 0) {
        this._currentTextProp = this._textProps[0];
      }

      this._otherProps = value.filter(value1 => this.getType(value1) === 'CHECK' || this.getType(value1) === 'MULTI-CHOICES');
    }
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

  isFiltrable(column: Column): boolean {
    return column._isFiltrable === undefined ? true : column._isFiltrable;
  }

  changeCurrentTextProp(prop: any) {
    this._currentTextProp = this._textProps.find(value => value._attrs[0] === prop.srcElement.value);
  }

}
