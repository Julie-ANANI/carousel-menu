import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sqFilter',
  templateUrl: './shared-filter-input.component.html',
})
export class SharedFilterInputComponent {
  @Input() config: any;
  @Input() size: Number = 15;
  @Output() configChange = new EventEmitter <any>();
  @Input() prop: string;

  constructor() {}

  filter(input: string) {
    const value = input;
    this.config.search = JSON.parse(this.config.search);
    if (this.config.search[this.prop] && value === '') {
      delete this.config.search[this.prop];
      this.config.search = JSON.stringify(this.config.search);
      this.configChange.emit(this.config);
    } else if (value !== '') {
      this.config.search[this.prop] = value;
      this.config.search = JSON.stringify(this.config.search);
      this.configChange.emit(this.config);
    }
  }
}
