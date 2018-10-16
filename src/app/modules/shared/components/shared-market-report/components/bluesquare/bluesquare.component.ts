import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-market-report-bluesquare',
  templateUrl: 'bluesquare.component.html',
  styleUrls: ['bluesquare.component.scss']
})

export class BluesquareComponent {

  @Input() set executiveReport(value: boolean) {
    this.executiveReportView = value;
  }

  @Input() numberFocus: number;
  @Input() subtitle: string;
  @Input() percentage: number;

  executiveReportView = false;

  constructor() {}

}
