import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sqFilterMulti',
  templateUrl: './shared-filter-multi.component.html',
  styleUrls: ['./shared-filter-multi.component.scss']
})
export class SharedFilterMultiComponent {

  @Input() config: any;
  @Output() configChange = new EventEmitter <any>();
  @Input() set props(value: string[]) {
    this.loadProps(value);
  }

  private _props: string[]  = [];
  private _currentProp = '';

  constructor() {}

  filter(event: any) {

    this._props.forEach(value1 =>
    {
      if (this.config.search[value1] && value1 !== this._currentProp) {
        delete this.config.search[value1]
      }
    });

    const value = (<HTMLInputElement> event.srcElement).value;
    if (this.config.search[this._currentProp] && value === '') {
      delete this.config.search[this._currentProp];
      this.configChange.emit(this.config);
    } else if (value !== '') {
      this.config.search[this._currentProp] = value;
      this.configChange.emit(this.config);
    }
  }

  loadProps(value: string[]) {
    if (value) {

      if (value.indexOf('firstName') !== -1 && value.indexOf('lastName') !== -1) {
        value.splice(value.indexOf('lastName'), 1);
      }
      this._props = value;
      if (!this._currentProp) {
        this._currentProp = this._props[0];
      }
    }
  }

  get props(): string[] {
      return this._props;
  }

  get currentProp(): string {
    return this._currentProp;
  }

  changeCurrentProp(prop: any) {
    this._currentProp = prop.srcElement.value;
  }

  getProp(prop: string): string {
    if (prop) {
      if (prop === 'firstName' || prop === 'lastName') {
        return 'Name';
      }
      return prop.charAt(0).toUpperCase() + prop.slice(1);
    }
  }
}
