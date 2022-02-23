import {Component, EventEmitter, Input, Output,OnInit, OnDestroy} from '@angular/core';
import {
  ExecutiveSection,
  SectionLikertScale
} from '../../../../../../../models/executive-report';
import {CommonService} from '../../../../../../../services/common/common.service';
import colorsAndNames from '../../../../../../../../../assets/json/likert-scale_executive-report.json';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Answer} from '../../../../../../../models/answer';
import {ResponseService} from '../../../../../../shared/components/shared-market-report/services/response.service';
import {DataService} from '../../../../../../shared/components/shared-market-report/services/data.service';
import {Question} from '../../../../../../../models/question';
import _ from 'lodash';
import {MissionQuestionService} from '../../../../../../../services/mission/mission-question.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-admin-section-type-likert-scale',
  templateUrl: './type-likert-scale.component.html',
  styleUrls: ['./type-likert-scale.component.scss']
})

export class TypeLikertScaleComponent implements OnInit, OnDestroy{

  ngOnInit(): void {
    this._liker = this.getLikertText(this._label);
    this._createChart();
  }

  @Input() question: Question = <Question>{};
  @Input() reportingLang = this._translateService.currentLang;
  @Input() isEditable = false;

  @Input() set section(value: ExecutiveSection) {
    this._section = value;
    this._content = <SectionLikertScale>this._section.content;
    this.textColor('title');
    this.textColor('abstract');
    this.textColor('name', 1);
    this.textColor('legend', 1);
  }


  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();
  @Output() playSection: EventEmitter<void> = new EventEmitter<void>();


  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _colorsAndNames = colorsAndNames;
  private _section: ExecutiveSection = <ExecutiveSection>{};
  private _titleColor = '';
  private _abstractColor = '';
  private _legendColor = '';
  private _liker = '';
  private _label: any = 'VALIDATED'

  private _content: SectionLikertScale = {
    name: this._colorsAndNames[2].name,
    legend: '',
    color: this._colorsAndNames[2].color
  };

  private _stackedChart: {
    likertScaleChart: object[],
    averageGeneralEvaluation?: number
  };

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
        this._label = this._colorsAndNames[index].name;
        this._content.color = this._colorsAndNames[index].color;
      });
  }

  public optionLabel(identifier: string) {
    const option = _.find(this.question.options, (option: any) => option.identifier === identifier);
    return MissionQuestionService.label(option, 'label', this.reportingLang);
  }

  public emitChanges() {
    if (this.isEditable) {
      this._section.content = this._content;
      this.sectionChange.emit(this._section);
    }
  }

  public textColor(field: string, index?: number) {

    switch (field) {

      case 'title':
        this._titleColor = CommonService.getLimitColor(this._section.title, 40);
        break;

      case 'abstract':
        this._abstractColor = CommonService.getLimitColor(this._section.abstract, 175);
        break;

      case 'legend':
          this._legendColor = CommonService.getLimitColor(this._content && this._content.legend, 13);
        break;
    }
  }

  public changeValueLabel (event: string) {
    this._label = event;
    this._liker = this.getLikertText(event);
  }

  public getLikertText(name: string) {
    const score = ['TOTALLY_INVALIDATED', 'INVALIDED','UNCERTAIN','VALIDATED','TOTALLY_VALIDATED'];
    if (score.indexOf(name.toUpperCase()) === -1)
    {
      return name;
    }else{
      const translate = 'ADMIN_EXECUTIVE_REPORT.LIKERT-SCALE_SECTION.'
      return translate + name.toUpperCase();
    }
  }

  public onClickPlay(event: Event) {
    event.preventDefault();
    this.playSection.emit();
  }

  public chooseColor(index: number) {
    this._content.color = this._colorsAndNames[index].color;
    this._content.name = this._colorsAndNames[index].name;
    this.emitChanges();
  }

  get section(): ExecutiveSection {
    return this._section;
  }

  get content(): SectionLikertScale {
    return this._content;
  }

  get titleColor(): string {
    return this._titleColor;
  }

  get abstractColor(): string {
    return this._abstractColor;
  }

  get legendColor(): string {
    return this._legendColor;
  }

  get colorsAndNames(): { name: string , color: string; }[] {
    return this._colorsAndNames;
  }

  get label():string {
    return this._label;
  }

  get liker(): string {
    return this._liker;
  }


  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
