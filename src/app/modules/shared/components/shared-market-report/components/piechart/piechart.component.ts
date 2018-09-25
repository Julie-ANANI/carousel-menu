import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

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

  private _datasets: Array<{data: Array<number>}>;
  private _colors: Array<{backgroundColor: Array<string>}>;
  private _labels: {[prop: string]: Array<string>};
  private _lang: string;
  private _percentage: number;
  private _labelPercentage: Array<{percentage: Array<string>}>;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this._lang = this.translateService.currentLang || 'en';
    this.translateService.onLangChange.takeUntil(this.ngUnsubscribe).subscribe((e: any) => {
      this._lang = e.lang;
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

}
