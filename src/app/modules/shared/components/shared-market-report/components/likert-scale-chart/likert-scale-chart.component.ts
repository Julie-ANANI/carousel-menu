import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {Answer} from '../../../../../../models/answer';
import {likertScaleThresholds, ResponseService} from '../../services/response.service';
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
    color: '',   // example #EA5858,
    visibility: false
  };

  /* Retrieves data for the progress bar averageFinalScore
  is an average score of all responses out of 5 */
  private _stackedChart: {
    likertScaleChart: object[],
    averageFinalScore?: number
  };

  private _likertScaleLabels = [ 'TOTALLY_INVALIDATED', 'INVALIDED', 'UNCERTAIN', 'VALIDATED', 'TOTALLY_VALIDATED']
  private _likertScaleColors = [
    `rgba(234,88,88,0.3)`,
    `rgba(248,148,36,0.3)`,
    `rgba(187,199,214,0.3)`,
    `rgba(153,224,75,0.3)`,
    `rgba(46,204,113,0.3)`
  ]

  private _gauge: { labels: any[]; delimiters: any[]; average: number; colors: any[] } = null;

  private _createChart() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe)).subscribe((answers: Array<Answer>) => {
      this._stackedChart = ResponseService.likertScaleChartData(answers, this.question, this.reportingLang);

      // Get likert scale score
      this._graphics = ResponseService.getLikertScaleGraphicScore(this._stackedChart.averageFinalScore);
      this._content.name = this._graphics.name;
      this._content.color = this._graphics.color;
      this._content.score = this._graphics.score;
      this._content.visibility = true;

      // Full opacity in chart for likert scale score
      const index = this._likertScaleLabels.findIndex(label => label === this._content.name)
      this._likertScaleColors[index] = this._likertScaleColors[index].replace((0.3).toString(), '1')

      this._gauge = {
        average: 2.5,
        colors: this._likertScaleColors,
        labels: this._likertScaleLabels,
        delimiters: likertScaleThresholds(2.25, 5)
      };
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

  get color(): string {
    return this._content.color;
  }

  get scorePercentage(): string {
    return this._content.scorePercentage;
  }

  get scoreRotate():string {
    return this._content.scoreRotate;
  }

  get content():SectionLikertScale {
    return this._content;
  }

  get gauge(): { labels: any[]; delimiters: any[]; average: number; colors: any[] } {
    return this._gauge;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
