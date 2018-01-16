/**
 * Created by bastien on 16/11/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { InnovationService } from './../../../../../services/innovation/innovation.service';
import * as _ from 'lodash';

@Component({
  selector: 'market-report-piechart',
  templateUrl: 'shared-market-report-piechart.component.html',
  styleUrls: ['shared-market-report-piechart.component.scss']
})

export class SharedMarketReportPiechartComponent implements OnInit {

  @Input() public pieChartData: any;
  @Input() public labels: string[];
  @Input() public percentage: number;

  constructor() { }

  ngOnInit() {
  }
}
