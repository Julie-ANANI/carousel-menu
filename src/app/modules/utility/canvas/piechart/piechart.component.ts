import {Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewChild} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {PieChart} from '../../../../models/pie-chart';
import {BaseChartDirective} from 'ng2-charts';
import {Multiling} from '../../../../models/multiling';

@Component({
  selector: 'app-utility-piechart',
  templateUrl: 'piechart.component.html',
  styleUrls: ['piechart.component.scss']
})

export class PiechartComponent {

  @Input() showFavorable = true;

  @Input() readonly = true;

  @Input() set pieChart(value: PieChart) {
    this._pieChart = value;
    this._loadData();
  }

  @Input() favorableAnswersLabel: Multiling;

  @ViewChild(BaseChartDirective, {static: false}) chart: BaseChartDirective;

  @Output() chartSectionClicked = new EventEmitter<{index: number, position: {x: number, y: number}}>();

  @Output() positiveLabelChanged = new EventEmitter<Multiling>();

  private _pieChart: PieChart = <PieChart>{};

  private _datasets: Array<{data: Array<number>}> = [];

  private _colors: Array<{backgroundColor: Array<string>}> = [];

  @Input() reportingLang = this._translateService.currentLang;

  private readonly _isBrowser = isPlatformBrowser(this.platformId);

  private _editFavorableAnswersLabel = false;

  private _options = {
    responsive: true
  };

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _translateService: TranslateService) { }

  chartClicked(event: any) {
    const currentChartIndexModified = event.active[0]._index;
    if (currentChartIndexModified >= 0) {
      this.chartSectionClicked.emit({
        index: currentChartIndexModified,
        position: {x: event.event.offsetX, y: event.event.offsetY}
      });
    }
  }

  private _loadData() {
    if (this._pieChart) {
      this._colors = [{backgroundColor: this._pieChart.colors || []}];
      this._datasets = [{data: this._pieChart.data || []}];

      if (this.chart) {
        this.chart.chart.data.datasets[0].backgroundColor = this._pieChart.colors || [];
        this.chart.chart.update();
      }
    }
  }

  get pieChart(): PieChart {
    return this._pieChart;
  }

  get datasets() {
    return this._datasets;
  }

  get colors() {
    return this._colors;
  }

  get isBrowser(): boolean {
    return this._isBrowser;
  }

  get options(): { responsive: boolean } {
    return this._options;
  }

  get editFavorableAnswersLabel(): boolean {
    return this._editFavorableAnswersLabel;
  }

  set editFavorableAnswersLabel(value: boolean) {
    this._editFavorableAnswersLabel = value;
  }
}
