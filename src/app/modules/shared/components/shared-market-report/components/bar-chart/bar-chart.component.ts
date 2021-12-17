import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FilterService} from '../../services/filters.service';
import {DataService} from '../../services/data.service';
import {ResponseService} from '../../services/response.service';
import {MissionFrontService} from '../../../../../../services/mission/mission-front.service';
import {MissionQuestionService} from '../../../../../../services/mission/mission-question.service';
import {Mission, MissionQuestion} from '../../../../../../models/mission';

import {Answer} from '../../../../../../models/answer';
import {Innovation} from '../../../../../../models/innovation';
import {Question} from '../../../../../../models/question';
import {BarData} from '../../models/bar-data';
import {AnswersStats} from '../../models/stats';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {PieChart} from '../../../../../../models/chart/pie-chart';
/*import {HorizontalStackedChart} from '../../../../../../models/chart/horizontal-stacked-chart';*/

@Component({
  selector: 'app-bar-chart',
  templateUrl: 'bar-chart.component.html',
  styleUrls: ['bar-chart.component.scss']
})

export class BarChartComponent implements OnInit, OnDestroy {

  @Input() innovation: Innovation = <Innovation>{};

  @Input() question: Question | MissionQuestion = <Question>{};

  @Input() readonly = true;

  @Input() stats: AnswersStats = null;

  @Input() toggleAnswers = false;
  @Input() reportingLang = this._translateService.currentLang;

  @Output() modalAnswerChange = new EventEmitter<any>();
  @Output() answerButtonClicked = new EventEmitter<boolean>();
  @Output() questionChanged = new EventEmitter<Question>();

  private _barsData: Array<BarData> = [];
  private _pieChart: PieChart = <PieChart>{};
 /* private _horizontalStackedChart : HorizontalStackedChart = <HorizontalStackedChart>{}*/
  private _showAnswers: {[index: string]: boolean} = {};
  private _toggleFilterIcon: {[index: string]: boolean} = {};
  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _updateAnswersData() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((answers: Array<Answer>) => {
        this._barsData = ResponseService.barsData(this.question, answers);
        if ( this.question.controlType === 'radio' ) {
          this._pieChart = ResponseService.pieChartData(this._barsData, answers);
        } /*else if (this.question.controlType === 'likert-scale'){
          this._horizontalStackedChart = ResponseService.horizontalStackedChartData(this._barsData, answers);
        }*/
      });
  }


  constructor(private _translateService: TranslateService,
              private _dataService: DataService,
              private _filterService: FilterService) { }

  ngOnInit() {
   this._updateAnswersData();
  }


  public filterAnswer(data: BarData, event: Event) {
    event.preventDefault();
    let filterValue: any;
    if (this._filterService.filters[this.question.identifier]) {
      filterValue = this._filterService.filters[this.question.identifier].value;
    } else {
      // @ts-ignore
      filterValue = this.question.options.reduce((acc, opt) => {
        acc[opt.identifier] = true; return acc; }, {} as any);
    }
    filterValue[data.identifier] = !filterValue[data.identifier];
    const removeFilter = Object.keys(filterValue).every((k) => filterValue[k] === true);
    if (removeFilter) {
      this._filterService.deleteFilter(this.question.identifier);
    } else {
      this._filterService.addFilter({
        status: <'CHECKBOX'|'RADIO'> this.question.controlType.toUpperCase(),
        questionId: this.question.identifier,
        value: filterValue
      });
    }
  }

  public seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }

  public toggleAnswer(event: Event) {
    event.preventDefault();
    this.toggleAnswers = !this.toggleAnswers;
    this.answerButtonClicked.emit(this.toggleAnswers);
  }

  public onShowAnswers(index: number, length: number) {
    if (length > 0) {
      this._showAnswers[index] = !this._showAnswers[index];
    }
  }

  public questionChange() {
    this._updateAnswersData();
    if (!this.hasMissionTemplate) {
      this.questionChanged.emit(<Question>this.question);
    }
  }

  public barDataLabel(barData: any) {
    return MissionQuestionService.label(barData, 'label', this.reportingLang);
  }


  get filter() {
    return this._filterService.filters[this.question.identifier];
  }

  get barsData(): Array<BarData> {
    return this._barsData;
  }

  get pieChart(): PieChart {
    return this._pieChart;
  }

  /*get horizontalStackedChart(): HorizontalStackedChart {
    return this._horizontalStackedChart;
  }*/

  get showAnswers(): { [p: string]: boolean } {
    return this._showAnswers;
  }

  get toggleFilterIcon(): { [p: string]: boolean } {
    return this._toggleFilterIcon;
  }

  get hasMissionTemplate(): boolean {
    return MissionFrontService.hasMissionTemplate(<Mission>this.innovation.mission);
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
