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
import colorsAndNamesAndPercentage from '../../../../../../../../assets/json/likert-scale_executive-report.json';


@Component({
  selector: 'app-likert-scale-chart',
  templateUrl: './likert-scale-chart.component.html',
  styleUrls: ['./likert-scale-chart.component.scss']
})

export class LikertScaleChartComponent implements OnInit, OnDestroy {

  ngOnInit() {
    this._createChart();
  }

  @Input() question: Question = <Question>{};
  @Input() reportingLang = this._translateService.currentLang;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _label: any = 'VALIDATED'
  private _colorsAndNames = colorsAndNamesAndPercentage;
  private _scorePercentage: number = 0;

  //Retrieves unmodifiable names and colours in a JSON file
  private _content: SectionLikertScale = {
    name: this._colorsAndNames[2].name,
    legend: '',
    color: this._colorsAndNames[2].color
  };

  //Retrieves data for the progress bar
  //averageGeneralEvaluation is an average score of all responses out of 20
  private _stackedChart: {
    likertScaleChart: object[],
    averageGeneralEvaluation?: number
  };

  isShowResult: boolean;


  constructor(private _dataService: DataService,
              private _translateService: TranslateService) {
  }


  private _createChart() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe))

      .subscribe((answers: Array<Answer>) => {
        this._stackedChart = ResponseService.likertScaleChartData(answers, this.question, this.reportingLang);
        const averageGeneralEvaluation = this._stackedChart.averageGeneralEvaluation || 0;

        // Choose which score label to display
        const index = (averageGeneralEvaluation - averageGeneralEvaluation % 4) / 4; // will give 0,1,2,3,4
        const scorePercentage = (averageGeneralEvaluation* 99) / 20; // will give margin percentage for the pointer of marker

        this._scorePercentage = scorePercentage;
        this._label = this._colorsAndNames[index].name;
        this._content.color = this._colorsAndNames[index].color;
      });
  }

  public optionLabel(identifier: string) {
    const option = _.find(this.question.options, (option: any) => option.identifier === identifier);
    return MissionQuestionService.label(option, 'label', this.reportingLang);
  }

  get stackedChart(): { likertScaleChart?: any[]; averageGeneralEvaluation?: number } {
    return this._stackedChart;
  }

  get label():string {
    return this._label;
  }

  get content(): string {
    return this._content.color;
  }

  get scorePercentage(): number {
    return this._scorePercentage;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
