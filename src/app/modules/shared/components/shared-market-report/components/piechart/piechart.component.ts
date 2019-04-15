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
    this._colors = [{backgroundColor: value.colors || []}];
    this._labels = value.labels || {};
    this._datasets = [{data: value.data || []}];
    this._percentage = value.percentage;
    this._labelPercentage = [{percentage: value.labelPercentage || []}];
  }

  @Input() set executiveReport(value: boolean) {
    this._executiveReportView = value;
  }

  private _executiveReportView = false;

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

  get executiveReportView(): boolean {
    return this._executiveReportView;
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
