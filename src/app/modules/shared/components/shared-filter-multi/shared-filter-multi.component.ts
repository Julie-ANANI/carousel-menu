import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Column, types} from '../shared-table/models/column';
import {Label} from '../shared-table/models/label';

@Component({
  selector: 'sqFilterMulti',
  templateUrl: './shared-filter-multi.component.html',
  styleUrls: ['./shared-filter-multi.component.scss']
})
export class SharedFilterMultiComponent {

  @Input() config: any;
  @Output() configChange = new EventEmitter <any>();
  @Input() set props(value: Column[]) {
    this.loadProps(value);
  }

  private _currentTextProp: Column = {_attr: [''], _name: '', _type: 'TEXT'};
  private _textProps: Column[] = [];
  private _otherProps: Column[] = [];

  constructor() {}

  filterText(event: any) {

    this.config.search = {};
    const value = event.value;
      if (value === '') {
        this.configChange.emit(this.config);
      } else {
        this.config.search[this._currentTextProp._attr[0]] = value;
        this.configChange.emit(this.config);
      }
  }

  filterOther(prop: Column) {
      if (this.config[prop._attr[0]] === null) {
        delete this.config[prop._attr[0]];
    }
    this.configChange.emit(this.config);
  }

  textIsSelected(prop: Column): boolean {
    return this._currentTextProp._attr[0] === prop._attr[0];
  }

  loadProps(value: Column[]) {
    if (value) {
      this._textProps = value.filter(value1 => this.getType(value1) !== 'CHECK' && this.getType(value1) !== 'LABEL' && this.getType(value1) !== 'ARRAY');
      if (this._currentTextProp._attr[0] === '' && this._textProps.length > 0) {
        this._currentTextProp = this._textProps[0];
      }

      this._otherProps = value.filter(value1 => this.getType(value1) === 'CHECK' || this.getType(value1) === 'LABEL');
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

  getAttr(column: Column) {
    return column._attr[0];
  }

  getName(column: Column) {
    return column._name;
  }

  getChoices(column: Column): Label[] {
    return column._choices || [];
  }

  getChoiceName(choice: Label): string {
    return choice._name;
  }

  changeCurrentTextProp(prop: any) {
    this._currentTextProp = this._textProps.find(value => value._attr[0] === prop.srcElement.value);
  }
}
