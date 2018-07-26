import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sq-sort',
  templateUrl: './shared-sort.component.html',
  styleUrls: ['./shared-sort.component.scss']
})
export class SharedSortComponent {
  @Input() config: any;
  @Output() configChange = new EventEmitter <any>();
  @Input() prop: string;

  constructor() {
  }

  public sort(event: Event): void {
    event.preventDefault();
    const previousOrder = this.config.sort[this.prop] || 0;
    const newOrder = previousOrder === 1 ? -1 : 1;
    this.config.sort = {};
    if (newOrder === 1 || newOrder === -1) {
      this.config.sort[this.prop] = newOrder;
    }
    this.configChange.emit(this.config);
  }

  get order(): number {
    return this.config.sort[this.prop] || 0;
  }
}
