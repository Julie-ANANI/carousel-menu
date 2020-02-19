import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ExecutiveSection} from '../../../../../models/executive-report';
import {InnovationFrontService} from '../../../../../services/innovation/innovation-front.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Question} from '../../../../../models/question';
import {ResponseService} from '../../shared-market-report/services/response.service';
// import { Answer } from '../../../../../models/answer';
// import { Question } from '../../../../../models/question';
// import { ResponseService } from '../../shared-market-report/services/response.service';
// import { Innovation } from '../../../../../models/innovation';
// import { Location } from '@angular/common';
// import { TranslateService } from '@ngx-translate/core';
// import { Tag } from '../../../../../models/tag';
// // import { InnovationService } from '../../../../../services/innovation/innovation.service';
// // import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
// import { DataService } from '../../shared-market-report/services/data.service';

@Component({
  selector: 'executive-section',
  templateUrl: './executive-section.component.html',
  styleUrls: ['./executive-section.component.scss']
})

export class ExecutiveSectionComponent implements OnInit, OnDestroy {

  @Input() set section(value: ExecutiveSection) {
    this._section = {
      questionId: value.questionId || '',
      questionType: value.questionType || '',
      abstract: value.abstract || '',
      label: value.label || '',
      content: value.content || <any>{}
    };
  }

  @Input() reportLang: 'en';

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _questionType: Array<{ label: any; alias: string }> = [
    { label: 'PIE', alias: 'Pie (preserved data)' },
    { label: 'RANKING', alias: 'Ranking (preserved data)' },
    { label: 'BAR', alias: 'Progress bars' },
    { label: 'QUOTE', alias: 'Quotation' },
    { label: 'KPI', alias: 'KPI' },
  ];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _questions: Array<Question> = [];

  /*@Input() set project(value: Innovation) {
    this._innovation = value;
    this._getQuestions(value);
  }

  @Input() set section(value: number) {
    this._sectionNumber = value;
  }

  @Input() set answers(value: Array<Answer>) {
    // this._answers = value;
    this._getSectionInformation(this._sectionNumber);
  }

  // private _answers: Array<Answer> = [];

  private _innovation: Innovation;

  private _sectionMenuOptions: Array<Question> = [];



  private _sectionNumber: number;

  private _questionSelected: Question;

  private _abstractValue = '';

  private _adminSide: boolean;

  private _stats: { nbAnswers?: number, percentage?: number };*/

  constructor(private _innovationFronService: InnovationFrontService,
    /*private _responseService: ResponseService,*/
              /*private _dataService: DataService,
              private _location: Location,
              private _translateService: TranslateService,*/
              /*private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService*/) {

    // this._adminSide = this._location.path().slice(5, 11) === '/admin';

  }

  ngOnInit(): void {

    this._innovationFronService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._questions = ResponseService.presets(innovation);
      console.log(this._questions);
    });

  }

  public emitChanges() {
    this.sectionChange.emit(this._section);
  }

  public selectQuestion(id: string) {
    this._section.questionId = id;
    this.emitChanges();
  }

  public selectQuestionType(type: any) {
    this._section.questionType = type;
    this.emitChanges();
  }

  /***
   * This function is to get the questions from the service, and then push it into the
   * respective arrays.
   * @param {Innovation} value
   */
  /*private _getQuestions(value: Innovation) {
    if (value.preset && value.preset.sections) {
      ResponseService.getPresets(value).forEach((questions) => {
        const index = this._questions.findIndex((question) => question._id === questions._id);
        if (index === -1) {
          this._questions.push(questions);
          this._sectionMenuOptions.push(questions);
        }
      });
    }
  }*/


  /***
   * This function is called when the operator clicked on anyone title
   * then we select that question and save that question id.
   * @param {Event} event
   * @param {Question} option
   */
  /*public onTitleClicked(event: Event, option: Question) {/!*
    this._innovation.executiveReport.sections[this._sectionNumber] = { quesId: option._id };

    this._innovationService.save(this._innovation._id, this._innovation).subscribe(() => {
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });

    this._getSectionInformation(this._sectionNumber);*!/
  }*/


  /***
   * Based on the sectionNumber we get the question id from the executiveReport.sections array and fill that section
   * with all the details.
   * @param {number} sectionNumber
   */
  /*private _getSectionInformation(sectionNumber: number) {

    /!*if (this._innovation.executiveReport.sections[sectionNumber]) {

      this._questionSelected = this._questions.find((ques) => ques._id === this._innovation.executiveReport.sections[sectionNumber].quesId);

      if (this._questionSelected) {

        const answersToShow = this._responseService.getAnswersToShow(this._answers, this._questionSelected);
        this._dataService.setAnswers(this._questionSelected, answersToShow);

        this._stats = {
          nbAnswers: answersToShow.length,
          percentage: Math.round((answersToShow.length * 100) / this._answers.length)
        };

        this._getAbstractValue();

      }

    }*!/

  }*/


  /***
   * this function is to get the abstract value from the abstracts array by using
   * quesId.
   */
  /*private _getAbstractValue() {

    this._abstractValue = '';

    if (this._innovation.executiveReport.abstracts) {
      const findAbstract = this._innovation.executiveReport.abstracts.find((ques) => ques.quesId === this._questionSelected._id);
      if (findAbstract) {
        this._abstractValue = findAbstract.value;
      }
    }

  }*/

  /*get lang(): string {
    return this._translateService.currentLang;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get sectionMenuOptions(): Array<Question> {
    return this._sectionMenuOptions;
  }

  get questionSelected(): Question {
    return this._questionSelected;
  }

  get abstractValue(): string {
    return this._abstractValue;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

  get stats(): { nbAnswers?: number; percentage?: number } {
    return this._stats;
  }

  get tags(): Array<Tag> {
    return this._dataService.answersTagsLists[this._questionSelected._id];
  }*/

  get section(): ExecutiveSection {
    return this._section;
  }

  get questionType(): Array<{ label: string; alias: string }> {
    return this._questionType;
  }

  get questions(): Array<Question> {
    return this._questions;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}


