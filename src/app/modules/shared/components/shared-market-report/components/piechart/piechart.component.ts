import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-piechart',
  templateUrl: 'piechart.component.html',
  styleUrls: ['piechart.component.scss']
})

export class PiechartComponent implements OnInit, OnDestroy {

  @Input() set pieChart(value: any) {
    this._pieChart = value;
    this._loadData();
  }

  private _pieChart: any;

  private _datasets: Array<{data: Array<number>}>;

  private _colors: Array<{backgroundColor: Array<string>}>;

  private _labels: {[prop: string]: Array<string>};

  private _lang: string;

  private _percentage: number;

  private _labelPercentage: Array<{percentage: Array<string>}>;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _translateService: TranslateService) {

    this._isBrowser = isPlatformBrowser(this.platformId);

  }

  ngOnInit() {
    this._lang = this._translateService.currentLang || 'en';

    this._translateService.onLangChange.pipe(takeUntil(this._ngUnsubscribe)).subscribe((e: any) => {
      this._lang = e.lang;
    });

    this._loadData();

  }


  private _loadData() {
    if (this._pieChart) {
      this._colors = [{backgroundColor: this._pieChart.colors || []}];
      this._labels = this._pieChart.labels || {};
      this._datasets = [{data: this._pieChart.data || []}];
      this._percentage = this._pieChart.percentage;
      this._labelPercentage = [{percentage: this._pieChart.labelPercentage || []}];
    }
  }


  get pieChart(): any {
    return this._pieChart;
  }

  get datasets() {
    return this._datasets;
  }

  get colors() {
    return this._colors;
  }

  get labels() {
    return this._labels;
  }

  get lang() {
    return this._lang;
  }

  get percentage() {
    return this._percentage;
  }

  get labelPercentage(): Array<{ percentage: Array<string> }> {
    return this._labelPercentage;
  }

  get isBrowser(): boolean {
    return this._isBrowser;
  }

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
