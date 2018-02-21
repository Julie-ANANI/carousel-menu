import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smart-select',
  templateUrl: './shared-smart-select.component.html',
  styleUrls: ['./shared-smart-select.component.scss']
})
export class SharedSmartSelectInputComponent {
  @Input() select: any;
  @Output() selectChange = new EventEmitter <any>();

  constructor() {
    this.select = this.select || {
        limit: 10,
        offset: 0
      };
  }

  update() {
    this.selectChange.emit(this.select);
  }
  cancel() {
    this.selectChange.emit(null);
  }
}
