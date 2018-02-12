/**
 * Created by bastien on 16/11/2017.
 */
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'market-report-piechart',
  templateUrl: 'shared-market-report-piechart.component.html',
  styleUrls: ['shared-market-report-piechart.component.scss']
})

export class SharedMarketReportPiechartComponent {

  @Input() public pieChartData: any;
  @Input() public percentage: number;

  constructor(private _translateService: TranslateService) { }

  get data(): Array<string> { return this.pieChartData.data; }
  get colors(): Array<string> { return this.pieChartData.data[0].backgroundColor; }
  get labels(): any { return this.pieChartData.labels; }
  get lang(): string { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
