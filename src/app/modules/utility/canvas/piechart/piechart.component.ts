import {Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewChild} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {PieChart} from '../../../../models/chart/pie-chart';
import {BaseChartDirective} from 'ng2-charts';
import {Picto, picto} from '../../../../models/static-data/picto';
import {oldColorsToNewMapping} from '../../../../utils/chartColors';
import {UmiusMultilingInterface} from '@umius/umi-common-component';

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

  @Input() favorableAnswersLabel: UmiusMultilingInterface;

  @Input() positiveSections: boolean[];

  @Input() reportingLang = this._translateService.currentLang;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  @Output() chartSectionColorChanged = new EventEmitter<{index: number, color: string}>();

  @Output() chartSectionPositiveChanged = new EventEmitter<{index: number, positive: boolean}>();

  @Output() positiveLabelChanged = new EventEmitter<UmiusMultilingInterface>();

  private _pieChart: PieChart = <PieChart>{};


  private _datasets: Array<{data: Array<number>}> = [];

  private _colors: Array<{backgroundColor: Array<string>}> = [];

  private readonly _isBrowser = isPlatformBrowser(this.platformId);

  private _editFavorableAnswersLabel = false;

  private _options = {
    responsive: true
  };

  private _picto: Picto = picto;

  private _indexSection: number = -1;
  private _indexLegend: number;
  private _offsetXSection: number;
  private _offsetYSection: number;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _translateService: TranslateService) { }

  chartClicked(event: any) {
    if(event.active && event.active.length){
      this.indexSection = event.active[0]._index;
    }else{
      this.indexSection = -1;
    }
    this.offsetXSection = event.event.offsetX;
    this.offsetYSection = event.event.offsetY;
  }

  chartColorChanged(event: any, index: number) {
    this.chartSectionColorChanged.emit({index: index, color: event});
    this.indexLegend = -1;
    this.indexSection = -1;
  }

  chartPositiveSectionChanged(index: number) {
    this.chartSectionPositiveChanged.emit({index: index, positive: this.positiveSections[index]});
  }



  private _loadData() {
    //Object composed of
    //   data?: Array<number>;
    //   colors?: Array<string>;
    //   labels: {[lang: string]: Array<string>};
    //   percentage?: number;
    //   labelPercentage?: Array<string>;
    if (this._pieChart) {

      //_color.example = 'background-color': colors[0].backgroundColor[i] return an color for all labels
      this._colors = [{backgroundColor: this._pieChart.colors.map(color => oldColorsToNewMapping[color || ''] || color) || []}];
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

  get picto(): Picto {
    return this._picto;
  }

  get offsetYSection(): number {
    return this._offsetYSection;
  }

  set offsetYSection(value: number) {
    this._offsetYSection = value;
  }
  get offsetXSection(): number {
    return this._offsetXSection;
  }

  set offsetXSection(value: number) {
    this._offsetXSection = value;
  }
  get indexSection(): number {
    return this._indexSection;
  }

  set indexSection(value: number) {
    this._indexSection = value;
  }

  get indexLegend(): number {
    return this._indexLegend;
  }

  set indexLegend(value: number) {
    this._indexLegend = value;
  }

  mouseLeave() {
    this._indexSection = -1;
  }
}
