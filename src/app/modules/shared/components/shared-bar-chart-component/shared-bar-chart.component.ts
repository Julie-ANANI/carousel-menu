/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bar-chart',
  templateUrl: 'shared-bar-chart.component.html',
  styleUrls: ['shared-bar-chart.component.scss']
})

export class SharedBarChartComponent implements OnInit {

  @Input() public options: any;
  @Input() public stats: any;
  @Input() public number: any;
  @Input() public displayCount: boolean;

  public index = 0;

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    if(!this.stats) {
      this.stats = {};
      this.options.forEach(option => {
        this.stats[option.identifier] = {
          percentage: 0,
          count: 0
        }
      })
    }
  }

  public barFill(percentage: number): string {
    return `${percentage}%`;
  }
  get lang(): any { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
};
