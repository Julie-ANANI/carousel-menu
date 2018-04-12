/**
 * Created by bastien on 16/11/2017.
 */
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Multiling } from '../../../../../../models/multiling';

@Component({
  selector: 'piechart',
  templateUrl: 'piechart.component.html',
  styleUrls: ['piechart.component.scss']
})

export class PiechartComponent {

  @Input() set pieChart(value: any) {
    this._datasets = [{data: value.data || [], backgroundColor: value.colors || []}];
    this._colors = value.colors || [];
    this._labels = value.labels.fr || [];
  }
  @Input() public percentage: number;

  private _datasets: Array<{data: Array<number>, backgroundColor: Array<string>}>;
  private _colors: Array<string>;
  private _labels: Multiling;

  constructor(private _translateService: TranslateService) { }

  get datasets() { return this._datasets; }
  get colors() { return this._colors; }
  get labels(): any { return this._labels; }
  get lang(): string { return this._translateService.currentLang || 'en'; }
}
