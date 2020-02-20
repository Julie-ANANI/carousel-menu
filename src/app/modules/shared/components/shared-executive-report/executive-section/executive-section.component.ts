import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExecutiveSection, SectionKpi, SectionQuote } from '../../../../../models/executive-report';
import { Question } from '../../../../../models/question';
import { MultilingPipe } from '../../../../../pipe/pipes/multiling.pipe';
import { Answer } from '../../../../../models/answer';
import { ResponseService } from '../../shared-market-report/services/response.service';
import { Professional } from '../../../../../models/professional';

@Component({
  selector: 'executive-section',
  templateUrl: './executive-section.component.html',
  styleUrls: ['./executive-section.component.scss']
})

export class ExecutiveSectionComponent {

  @Input() questions: Array<Question> = [];

  @Input() answers: Array<Answer> = [];

  @Input() reportLang: 'en';

  @Input() set section(value: ExecutiveSection) {
    this._section = {
      questionId: value.questionId || '',
      questionType: value.questionType || '',
      abstract: value.abstract || '',
      label: value.label || '',
      content: value.content || <any>{}
    };
  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _questionType: Array<{ label: any; alias: string }> = [
    { label: 'PIE', alias: 'Pie (preserved data)' },
    { label: 'RANKING', alias: 'Ranking (preserved data)' },
    { label: 'BAR', alias: 'Progress bars' },
    { label: 'QUOTE', alias: 'Quotation' },
    { label: 'KPI', alias: 'KPI' },
  ];

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

  constructor(private _multilingPipe: MultilingPipe,
              private _responseService: ResponseService) { }

  public emitChanges() {
    this.sectionChange.emit(this._section);
  }

  public selectQuestion(id: string) {
    this._section.questionId = id;
    this.emitChanges();
  }

  public selectQuestionType(type: any) {
    if (this._section.questionId) {
      this._section.questionType = type;
      this._initializeSection();
      this.emitChanges();
    }
  }

  public onSectionUpdate(value: ExecutiveSection) {
    this._section = value;
    this.emitChanges();
  }

  private _initializeSection() {
    switch (this._section.questionType) {

      case 'KPI':
        this._setKpiData();
        break;

      case 'QUOTE':
        this._setQuoteData();
        break;
    }
  }

  private _setKpiData() {
    const question: Question = this._getQuestion(this._section.questionId);
    const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
    const professionals: Array<Professional> = ResponseService.answersProfessionals(answers);

    this._section.label = this._multilingPipe.transform(question.title, this.reportLang);
    (<SectionKpi>this._section.content).kpi = answers.length.toString(10);

    (<SectionKpi>this._section.content).examples = professionals.map((professional, index) => {
      return index === 0 ? professional.firstName + ' ' + professional.lastName
        : ' ' + professional.firstName + ' ' + professional.lastName
    }).toString().slice(0, 175);

  }

  private _setQuoteData() {
    const question: Question = this._getQuestion(this._section.questionId);
    this._section.label = this._multilingPipe.transform(question.title, this.reportLang);
    (<SectionQuote>this._section.content).showQuotes = true;
  }

  private _getQuestion(id: string): Question {
    const index = this.questions.findIndex((ques) => ques._id === id);
    if (index !== -1) {
      return this.questions[index];
    }
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

}


