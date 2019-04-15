import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-market-report-bluesquare',
  templateUrl: 'bluesquare.component.html',
  styleUrls: ['bluesquare.component.scss']
})

export class BluesquareComponent {

  @Input() numberFocus: number;

  @Input() subtitle: string;

  @Input() percentage: number;

  constructor() {}

}
