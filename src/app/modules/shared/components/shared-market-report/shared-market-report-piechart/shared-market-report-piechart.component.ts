/**
 * Created by bastien on 16/11/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'market-report-piechart',
  templateUrl: 'shared-market-report-piechart.component.html',
  styleUrls: ['shared-market-report-piechart.component.scss']
})

export class SharedMarketReportPiechartComponent implements OnInit {

  @Input() public pieChartData: any;
  @Input() public percentage: number;

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
  }
  get data(): string[] { return this.pieChartData.data; }
  get colors(): string[] { return this.pieChartData.data[0].backgroundColor; }
  get labels(): any { return this.pieChartData.labels; }
  get lang(): any { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
