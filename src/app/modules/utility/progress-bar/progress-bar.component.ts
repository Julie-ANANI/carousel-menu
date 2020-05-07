import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
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
