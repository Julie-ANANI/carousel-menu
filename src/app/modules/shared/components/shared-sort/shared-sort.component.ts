import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shared-sort',
  templateUrl: './shared-sort.component.html',
  styleUrls: ['./shared-sort.component.scss']
})

export class SharedSortComponent {

  /***
   * Use this input attribute when you have only one key
   * for the sorting.
   * @param value
   */
  @Input() set property(value: string) {
    this._property = value;
  }

  /***
   * Use this input attribute when you have more than one
   * key for the property.
   * @param value
   */
  @Input() set properties(value: Array<string>) {
    this._properties = value;

    for (let propertyKey of this._properties) {
      this._property = propertyKey;
    }

  }

  @Input() set sortConfig(value: string) {
    this._sort = value;
    this._getCurrentKeyValue();
  }

  @Input() set label(value: string) {
    this._label = value;
  }

  @Output() sortConfigChange: EventEmitter<string> = new EventEmitter<string>();

  private _property: string;

  private _label: string;

  private _sort: string;

  private _currentKey: string;

  private _currentKeyValue: number;

  private _properties: Array<string> = [];

  constructor() {}

  private _getCurrentKeyValue() {
    const currentSort = this.currentSort;

    for (let sortKey of Object.keys(currentSort)) {
      this._currentKey = sortKey;
      this._currentKeyValue = currentSort[sortKey];
    }

  }

  public sort(event: Event): void {
    event.preventDefault();

    let newOrder: number;
    let newSort;

    if (this._currentKey === this._property) {
      newOrder = this._currentKeyValue === 1 ? -1 : 1;
    } else {
      newOrder = -1;
      this._currentKey = this._property;
    }

    if (this._properties.length > 1) {

      newSort = this._properties.reduce((acc, key) => {
        return {...acc, ...{ [key]: newOrder }};
      }, {});

    } else {
      newSort = { [this._currentKey]: newOrder };
    }

    this.sortConfigChange.emit(JSON.stringify(newSort));

  }

  get currentSort() {
    return !!this._sort ? JSON.parse(this._sort) : {};
  }

  get order(): number {
    return this._currentKey === this._property ? this._currentKeyValue : 0;
  }

  get property(): string {
    return this._property;
  }

  get label(): string {
    return this._label;
  }

  get currentKey(): string {
    return this._currentKey;
  }

  get currentKeyValue(): number {
    return this._currentKeyValue;
  }

  get properties(): Array<string> {
    return this._properties;
  }

}
