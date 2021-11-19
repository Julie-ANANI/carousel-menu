import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-utility-progress-bar',
  template: `
  <div [attr.data-tooltip]="width" [ngClass]="{ 'tooltip': showTooltip }" [ngStyle]="{ 'height': height }"
     id="progress-bar">
  <div [ngStyle]="{ 'width': width, 'background-color': backgroundColor, 'height': height }" class="inner-wrapper">
    <ng-container *ngIf="value">{{ value }}</ng-container>
  </div>
</div>
  `,
  styleUrls: ['./progress-bar.component.scss']
})

export class ProgressBarComponent {

  @Input() value = '';

  @Input() width = '';

  @Input() height = '20px';

  @Input() backgroundColor = '#4F5D6B';

  @Input() showTooltip = false;

  constructor() { }

}
