import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sqFilter',
  templateUrl: './shared-filter-input.component.html',
  styleUrls: ['./shared-filter-input.component.scss']
})
export class SharedFilterInputComponent {
  @Input() config: any;
  @Output() configChange = new EventEmitter <any>();
  @Input() prop: string;

  constructor() {}

  filter(event: any) {
    const value = (<HTMLInputElement> event.srcElement).value;
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
