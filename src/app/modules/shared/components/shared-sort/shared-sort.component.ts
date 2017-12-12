import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'sq-sort',
  templateUrl: './shared-sort.component.html',
  styleUrls: ['./shared-sort.component.scss']
})
export class SharedSortComponent implements OnInit {
  @Input() config: any;
  @Output() configChange = new EventEmitter <any>(); 
  @Input() prop: string;

  constructor() {
  }

  ngOnInit() {
  }

  public sort(): void {
    const previousOrder = this.config.sort[this.prop] || 0;
    const newOrder = previousOrder == 1 ? -1 : previousOrder + 1;
    this.config.sort = {};
    if (newOrder == 1 || newOrder == -1) {
      this.config.sort[this.prop] = newOrder;
    }
    this.configChange.emit(this.config);
  }

  get order(): number {
    return this.config.sort[this.prop] || 0;
  }
}
