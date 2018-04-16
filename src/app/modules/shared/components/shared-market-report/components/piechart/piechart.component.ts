/**
 * Created by bastien on 16/11/2017.
 */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'piechart',
  templateUrl: 'piechart.component.html',
  styleUrls: ['piechart.component.scss']
})

export class PiechartComponent implements OnInit, OnDestroy {

  @Input() set pieChart(value: any) {
    this._colors = [{backgroundColor: value.colors || []}];
    this._labels = value.labels || {};
    this._datasets = [{data: value.data || []}];
  }
  @Input() public percentage: number;

  private _datasets: Array<{data: Array<number>}>;
  private _colors: Array<{backgroundColor: Array<string>}>;
  private _labels: {[prop: string]: Array<string>};
  private _lang: string;
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this._lang = this.translateService.currentLang || 'en';
    this.translateService.onLangChange.takeUntil(this.ngUnsubscribe).subscribe((e) => {
      this._lang = e.lang;
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get datasets() { return this._datasets; }
  get colors() { return this._colors; }
  get labels() { return this._labels; }
  get lang(): string { return this._lang; }
}
