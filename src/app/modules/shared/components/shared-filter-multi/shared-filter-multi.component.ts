import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Column} from '../shared-table/models/column';
import {Types} from '../shared-table/models/types';
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

  private _currentTextProp: Column = {_attr: '', _name: '', _type: 'TEXT'};
  private _textProps: Column[] = [];
  private _otherProps: Column[] = [];

  constructor() {}

  filterText(event: any) {

    this._textProps.forEach(value1 =>
    {
      if (this.config.search[value1._attr] && value1._attr !== this._currentTextProp._attr) {
        delete this.config.search[value1._attr]
      }
    });

    const value = (<HTMLInputElement> event.srcElement).value;
    if (this.config.search[this._currentTextProp._attr] && value === '') {
      delete this.config.search[this._currentTextProp._attr];
      this.configChange.emit(this.config);
    } else if (value !== '') {
      this.config.search[this._currentTextProp._attr] = value;
      this.configChange.emit(this.config);
    }
  }

  filterOther(event: any, prop: Column) {
    if (this.config[prop._attr] === null) {
      delete this.config[prop._attr];
    }
    this.configChange.emit(this.config);
  }

  textIsSelected(prop: Column): boolean {
    return this._currentTextProp._attr === prop._attr;
  }

  loadProps(value: Column[]) {
    if (value) {
      if (value.find(value1 => value1._attr.toLowerCase() === 'firstname') &&
        value.find(value1 => value1._attr.toLowerCase() === 'lastname')) {
        value = value.filter(value1 => value1._attr.toLowerCase() !== 'lastname');
      }
      this._textProps = value.filter(value1 => this.getType(value1) === Types.TEXT);
      if (this._currentTextProp._attr === '' && this._textProps.length > 0) {
        this._currentTextProp = this._textProps[0];
      }

      this._otherProps = value.filter(value1 => this.getType(value1) !== Types.TEXT);
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

  getType(column: Column): Types {
    let typeKey = 'TEXT';
    for (const typesKey in Types) {
      if (column._type === typesKey) {
        typeKey = typesKey;
      }
    }
    return Types[typeKey];
  }

  getAttr(column: Column) {
    return column._attr;
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
    this._currentTextProp = this._textProps.find(value => value._attr === prop.srcElement.value);
  }

  getTextProp(prop: Column): string {
    if (prop) {
      if (prop._attr.toLowerCase() === 'firstname' || prop._attr.toLowerCase() === 'lastname') {
        return 'Name';
      }
      return prop._name.charAt(0).toUpperCase() + prop._name.slice(1).toLowerCase();
    }
  }
}
