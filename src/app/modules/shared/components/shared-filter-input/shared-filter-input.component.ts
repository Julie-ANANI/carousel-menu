import { Component, Input } from '@angular/core';

@Component({
  selector: 'sqFilter',
  templateUrl: './shared-filter-input.component.html',
  styleUrls: ['./shared-filter-input.component.scss']
})
export class SharedFilterInputComponent {
  @Input() service: any;
  @Input() prop: string;

  constructor() {}

  filter(event) {
    console.log(event);
    this.service.filter(this.prop, (<HTMLInputElement> event.srcElement).value);
  }
}
