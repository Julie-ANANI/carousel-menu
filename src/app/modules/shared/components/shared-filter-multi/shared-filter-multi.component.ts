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

    this._textProps.forEach(value1 =>
    {
      for (const i in value1._attr) {
        if (this.config.search[i] && value1._attr[i] !== this._currentTextProp._attr[i]) {
          delete this.config.search[value1._attr[i]]
      }
    }
    });

    const value = (<HTMLInputElement> event.srcElement).value;
    for (const i in this.currentTextProp._attr) {
      if (this.config.search[i] && value === '') {
        delete this.config.search[i];
        this.configChange.emit(this.config);
      } else if (value !== '') {
        this.config.search[i] = value;
        this.configChange.emit(this.config);
      }
    }
  }

  filterOther(event: any, prop: Column) {
    for (const i in prop._attr) {
      if (this.config[i] === null) {
        delete this.config[i];
      }
    }
    this.configChange.emit(this.config);
  }

  textIsSelected(prop: Column): boolean {
    return this._currentTextProp._attr === prop._attr;
  }

  loadProps(value: Column[]) {
    if (value) {
      this._textProps = value.filter(value1 => this.getType(value1) === 'TEXT');
      if (this._currentTextProp._attr[0] === '' && this._textProps.length > 0) {
        this._currentTextProp = this._textProps[0];
      }

      this._otherProps = value.filter(value1 => this.getType(value1) !== 'TEXT');
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
}
