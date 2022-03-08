import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {Answer} from '../../../../../../models/answer';
import {ResponseService} from '../../services/response.service';
import {DataService} from '../../services/data.service';
import {Question} from '../../../../../../models/question';
import {Subject} from 'rxjs';
import _ from 'lodash';
import {MissionQuestionService} from '../../../../../../services/mission/mission-question.service';
import {SectionLikertScale} from '../../../../../../models/executive-report';


@Component({
  selector: 'app-likert-scale-chart',
  templateUrl: './likert-scale-chart.component.html',
  styleUrls: ['./likert-scale-chart.component.scss']
})

export class LikertScaleChartComponent implements OnInit, OnDestroy {

  @Input() question: Question = <Question>{};
  @Input() reportingLang = this._translateService.currentLang;


  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _graphics : any;
  isShowResult: boolean;

  private _content: SectionLikertScale = {
    name: '',  // example totally  invalided
    color: '',   // example #EA5858
  };

  /* Retrieves data for the progress bar averageFinalScore
  is an average score of all responses out of 5 */
  private _stackedChart: {
    likertScaleChart: object[],
    averageFinalScore?: number
  };

  /*private _dataGraphic: LikertScaleDataScore = {
    name: '',  // example totally  invalided
    color: '',   // example #EA5858
    score: 0,
    scorePercentage: '',
    index: 0,
  };*/



  private _createChart() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe)).subscribe((answers: Array<Answer>) => {
      this._stackedChart = ResponseService.likertScaleChartData(answers, this.question, this.reportingLang);

      this._graphics = ResponseService.getLikertScaleGraphicScore(this._stackedChart.averageFinalScore);
      this._content.name = this._graphics.name;
      this._content.color = this._graphics.color;
      this._content.score = this._graphics.score;
      this._content.percentage = this._graphics.scorePercentage;
      });
  }


  constructor( private _dataService: DataService,
               private _translateService: TranslateService) {}


  ngOnInit() {
    this._createChart();
  }

  public optionLabel(identifier: string) {
    const option = _.find(this.question.options, (option: any) => option.identifier === identifier);
    return MissionQuestionService.label(option, 'label', this.reportingLang);
  }

  get stackedChart(): { likertScaleChart?: any[]; averageFinalScore?: number } {
    return this._stackedChart;
  }

  get label():string {
    return this._content.name;
  }

  get content(): string {
    return this._content.color;
  }

  get scorePercentage(): number {
    return this._content.percentage;
  }


  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
