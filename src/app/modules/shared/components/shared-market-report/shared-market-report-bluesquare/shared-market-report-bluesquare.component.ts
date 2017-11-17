/**
 * Created by bastien on 16/11/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { InnovationService } from './../../../../../services/innovation/innovation.service';
import * as _ from 'lodash';

@Component({
  selector: 'market-report-bluesquare',
  templateUrl: 'shared-market-report-piechart.bluesquare.html',
  styleUrls: ['shared-market-report-piechart.bluesquare.scss']
})

export class SharedMarketReportBluesquareComponent implements OnInit {

  @Input() public number: number;
  @Input() public i18n: string;
  @Input() public percentage: number;

  constructor() { }

  ngOnInit() {
  }
}
