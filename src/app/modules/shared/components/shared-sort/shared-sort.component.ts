import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shared-sort',
  templateUrl: './shared-sort.component.html',
  styleUrls: ['./shared-sort.component.scss']
})

export class SharedSortComponent {

  @Input() set config(value: any) {
    this._config = value;
  }

  @Input() set property(value: string) {
    this._property = value;
  }

  @Output() configChangeSort = new EventEmitter <any>();

  private _property: string;

  private _config: any;

  constructor() {}

  public sort(event: Event): void {
    event.preventDefault();

    const previousOrder = this._config.sort[this._property] || 0;
    const newOrder = previousOrder === 1 ? -1 : 1;
    this._config.sort = {};

    if (newOrder === 1 || newOrder === -1) {
      this._config.sort[this._property] = newOrder;
    }

    this.configChangeSort.emit(this._config);

  }

  get order(): number {
    return this._config.sort[this._property] || 0;
  }

  get property(): string {
    return this._property;
  }

  get config(): any {
    return this._config;
  }

}
