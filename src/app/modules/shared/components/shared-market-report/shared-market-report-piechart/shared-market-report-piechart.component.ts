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
  @Input() public options: any;
  @Input() public percentage: number;

  private _labels : any;

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    this._labels = {
      en: this.options.map((o: any) => o.label.en),
      fr: this.options.map((o: any) => o.label.fr)
    };
  }
  set labels(value: any) { this._labels = value; }
  get labels(): any { return this._labels; }
  get lang(): any { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
