/**
 * Created by bastien on 16/11/2017.
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'market-report-bluesquare',
  templateUrl: 'shared-market-report-bluesquare.component.html',
  styleUrls: ['shared-market-report-bluesquare.component.scss']
})

export class SharedMarketReportBluesquareComponent {

  @Input() public numberFocus: number;
  @Input() public id: string;
  @Input() public subtitle: string;
  @Input() public percentage: number;

  constructor() { }

}
