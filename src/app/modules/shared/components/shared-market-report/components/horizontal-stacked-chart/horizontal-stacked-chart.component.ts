import {Component, EventEmitter, Input, Output, OnInit,ViewChild, OnDestroy} from '@angular/core';
import {Multiling} from '../../../../../../models/multiling';
import {BaseChartDirective} from 'ng2-charts';
import {isPlatformBrowser} from '@angular/common';
import {Picto, picto} from '../../../../../../models/static-data/picto';
import {TranslateService} from '@ngx-translate/core';
import {oldColorsToNewMapping} from '../../../../../../utils/chartColors';
import {HorizontalStackedChart} from '../../../../../../models/chart/horizontal-stacked-chart';
import {takeUntil} from 'rxjs/operators';
import {Answer} from '../../../../../../models/answer';
import {ResponseService} from '../../services/response.service';
import{DataService} from '../../services/data.service';
import {Question} from '../../../../../../models/question';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-utility-horizontal-stacked-chart',
  templateUrl: './horizontal-stacked-chart.component.html',
  styleUrls: ['./horizontal-stacked-chart.component.scss']
})

export class HorizontalStackedChartComponent implements OnInit, OnDestroy {

  //chantier rank data
  @Input() question: Question = <Question>{};
  @Input() reportingLang = this._translateService.currentLang;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _dataService: DataService,
              private _translateService: TranslateService) {
  }

  ngOnInit() {
    this._createChart();
  }

  private _createChart() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((answers: Array<Answer>) => {
        this._horizontalStackedChart = ResponseService.horizontalStackedChartData(answers, this.question, this.reportingLang);
      });
  }

/*  private _updateAnswersData() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((answers: Array<Answer>) => {
        this._barsData = ResponseService.barsData(this.question, answers);
        if ( this.question.controlType === 'radio' ) {
          this._pieChart = ResponseService.pieChartData(this._barsData, answers);
        } else if (this.question.controlType === 'likert-scale'){
          this._horizontalStackedChart = ResponseService.horizontalStackedChartData(this._barsData, answers);
        }
      });
  }*/



  @Input() showFavorable = true;

  @Input() readonly = true;

  @Input() set horizontalStackedChart(value: HorizontalStackedChart) {
    this._horizontalStackedChart = value;
    this._loadData();
  }

  @Input() favorableAnswersLabel: Multiling;

  @Input() positiveSections: boolean[];

  @ViewChild(BaseChartDirective, {static: false}) chart: BaseChartDirective;

  @Output() chartSectionColorChanged = new EventEmitter<{index: number, color: string}>();

  @Output() chartSectionPositiveChanged = new EventEmitter<{index: number, positive: boolean}>();

  @Output() positiveLabelChanged = new EventEmitter<Multiling>();


  private _datasets: Array<{data: Array<number>}> = [];
  private _colors: Array<{backgroundColor: Array<string>}> = [];
  private readonly _isBrowser = isPlatformBrowser(this.platformId);
  private _editFavorableAnswersLabel = false;
  private _options = {
    responsive: true
  };
  private _picto: Picto = picto;
  private _indexSection: number;
  private _indexLegend: number;
  private _offsetXSection: number;
  private _offsetYSection: number;
  private _horizontalStackedChart: HorizontalStackedChart = <HorizontalStackedChart>{};
  private _validation: string;


 /* constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _translateService: TranslateService) { }*/

  chartClicked(event: any) {
    this.indexSection = event.active[0]._index;
    this.offsetXSection = event.event.offsetX;
    this.offsetYSection = event.event.offsetY;
  }

  chartPositiveSectionChanged(index: number) {
    this.chartSectionPositiveChanged.emit({index: index, positive: this.positiveSections[index]});
  }

  private _loadData() {

    if (this._horizontalStackedChart) {

      this._colors = [{backgroundColor: this._horizontalStackedChart.colors.map(color => oldColorsToNewMapping[color || ''] || color) || []}];
      this._datasets = [{data: this._horizontalStackedChart.data || []}];

      /*if (this.chart) {
        this.chart.chart.data.datasets[0].backgroundColor = this._horizontalStackedChart.colors || [];
        this.chart.chart.update();
      }*/
    }
  }

  get horizontalStackedChart() : HorizontalStackedChart {
    return this._horizontalStackedChart;
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

  get validation():string {
    return this._validation
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
