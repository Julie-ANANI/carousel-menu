import {Component, EventEmitter, Input, Output,OnInit, OnDestroy} from '@angular/core';
import {
  ExecutiveSection,
  SectionLikertScale
} from '../../../../../../../models/executive-report';
import {CommonService} from '../../../../../../../services/common/common.service';
import colorsAndNames from '../../../../../../../../../assets/json/likert-scale_executive-report.json';
import {Subject} from 'rxjs';
import {Question} from '../../../../../../../models/question';
import {TranslateService} from '@ngx-translate/core';
import {MissionQuestion} from '../../../../../../../models/mission';


@Component({
  selector: 'app-admin-section-type-likert-scale',
  templateUrl: './type-likert-scale.component.html',
  styleUrls: ['./type-likert-scale.component.scss']
})

export class TypeLikertScaleComponent implements OnInit, OnDestroy {

  /* Le problème c'est que je lui passe une question alors qu'il ne le récupère pas */

  //@Input() question: any;
  /*@Input() set question( value: Question | MissionQuestion ) {
    this._question = value;
  }*/

  @Input() questions: Array<Question | MissionQuestion> = [];

  /*get questions(): Array<Question | MissionQuestion> {
    return this._questions;
  }
*/

 // private _questions: Array<Question | MissionQuestion> = [];




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

  //@Output() question = new EventEmitter<Question>();

  //private _question: Question | MissionQuestion = <MissionQuestion | Question>{};

  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _colorsAndNames = colorsAndNames;
  private _section: ExecutiveSection = <ExecutiveSection>{};
  private _titleColor = '';
  private _abstractColor = '';
  private _legendColor = '';
  private _nameColor = '';

  //private _liker = '';
  private _label: any = 'VALIDATED'

  private _content: SectionLikertScale = {
    name: this._colorsAndNames[2].name,
    legend: '',
    color: this._colorsAndNames[2].color
  };

 /* private _stackedChart: {
    likertScaleChart: object[],
    averageGeneralEvaluation?: number
  };
*/
  private _scorePercentage: number = 0;

  constructor ( //private _dataService: DataService,
                private _translateService: TranslateService ) {}

  ngOnInit(): void {
    this._label = this.getLikertText(this._content.name);
   // this._createChart();

   // setTimeout(() => { console.log('question is:',this._question) });

  }

/*  private _createChart() {
   console.log(this.questions);
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe)).subscribe((answers: Array<Answer>) => {
      this._stackedChart = ResponseService.likertScaleChartData(answers, this.question, this.reportingLang);
      const averageGeneralEvaluation = this._stackedChart.averageGeneralEvaluation || 0;

      // Choose which score label to display
      const index = (averageGeneralEvaluation - averageGeneralEvaluation % 4) / 4; // will give 0,1,2,3,4
      const scorePercentage = (averageGeneralEvaluation * 98) / 20; // will give margin percentage for the pointer of marker

      this._scorePercentage = scorePercentage;
      this._content.name = this._colorsAndNames[index].name;
      this._content.color = this._colorsAndNames[index].color;
    });
  }*/

 /* public optionLabel(identifier: string) {
    const option = _.find(this.question.options, (option: any) => option.identifier === identifier);
    return MissionQuestionService.label(option, 'label', this.reportingLang);
  }*/

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
      case 'name':
        this._nameColor = CommonService.getLimitColor(this._content && this._content.name, 20);
    }
  }

  public changeValueLabel (event: string) {
    this._content.name = event;
    this._label= this.getLikertText(event);
  }

  public getLikertText(name: string) {
    const nameScore = ['TOTALLY_INVALIDATED', 'INVALIDED','UNCERTAIN','VALIDATED','TOTALLY_VALIDATED'];

    if (nameScore.indexOf(name.toUpperCase()) === -1)
    {
      return name;
    }else{
      //const translate = 'ADMIN_EXECUTIVE_REPORT.LIKERT-SCALE_SECTION.'
      const translate = 'MARKET_REPORT.LIKERT-SCALE_SECTION.'
      return translate + name.toUpperCase();
    }
  }

  public onClickPlay(event: Event) {
    event.preventDefault();
    this.playSection.emit();
  }

  public chooseColor(index: number) {
    this._content.color = this._colorsAndNames[index].color;
   // this._label = this._colorsAndNames[index].name;
    this.content.name = this._colorsAndNames[index].name;
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

  /*get liker(): string {
    return this._liker;
  }*/

  get nameColor():string {
    return this._nameColor;
  }

  get scorePercentage(): number {
    return this._scorePercentage;
  }

  /*get question(): Question | MissionQuestion {
    return this._question;
  }*/

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
