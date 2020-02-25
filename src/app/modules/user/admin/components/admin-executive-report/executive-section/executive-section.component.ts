import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../../../../../../models/question';
import { Answer } from '../../../../../../models/answer';
import { ExecutiveSection, SectionBar, SectionKpi, SectionQuote, SectionRanking } from '../../../../../../models/executive-report';
import { MultilingPipe } from '../../../../../../pipe/pipes/multiling.pipe';
import { ResponseService } from '../../../../../shared/components/shared-market-report/services/response.service';
import { Professional } from '../../../../../../models/professional';
import { BarData } from '../../../../../shared/components/shared-market-report/models/bar-data';
import { Tag } from '../../../../../../models/tag';
import { specialCharRegEx } from '../../../../../../utils/regex';

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
      title: value.title || '',
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

      case 'BAR':
        this._setBarData();
        break;

      case 'RANKING':
        this._setRankingData();
        break;

      case 'PIE':
        this._setPieData();
        break;
    }
  }

  private _setKpiData() {
    const question: Question = this._getQuestion(this._section.questionId);
    const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
    const professionals: Array<Professional> = ResponseService.answersProfessionals(answers);

    this._section.title = this._multilingPipe.transform(question.title, this.reportLang);
    (<SectionKpi>this._section.content).value = answers.length.toString(10);

    (<SectionKpi>this._section.content).examples = professionals.map((professional, index) => {
      return index === 0 ? professional.firstName + ' ' + professional.lastName
        : ' ' + professional.firstName + ' ' + professional.lastName
    }).toString().slice(0, 175);

  }

  private _setQuoteData() {
    const question: Question = this._getQuestion(this._section.questionId);
    this._section.title = this._multilingPipe.transform(question.title, this.reportLang);
    (<SectionQuote>this._section.content).showQuotes = true;
  }

  private _setBarData() {
    const question: Question = this._getQuestion(this._section.questionId);
    this._section.title = this._multilingPipe.transform(question.title, this.reportLang);
    (<SectionBar>this._section.content).showExamples = true;

    if (question.controlType === 'checkbox' || question.controlType === 'radio') {
      const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
      const barsData: Array<BarData> = ResponseService.barsData(question, answers);
      (<SectionBar>this._section.content).values = [];

      barsData.slice(0, 3).forEach((bar, index) => {

        const professionals: Array<Professional> = ResponseService.answersProfessionals(bar.answers);

        (<SectionBar>this._section.content).values.push({
          name: this._multilingPipe.transform(bar.label, this.reportLang),
          value: Number(bar.absolutePercentage.replace(specialCharRegEx, '')) || 0,
          example: professionals.map((professional, index) => {
            return index === 0 ? professional.jobTitle : ' ' + professional.jobTitle
          }).toString().slice(0, 40)
        })
      });

    }

  }

  private _setRankingData() {
    const question: Question = this._getQuestion(this._section.questionId);
    this._section.title = this._multilingPipe.transform(question.title, this.reportLang);
    (<SectionRanking>this._section.content).color = '#4F5D6B';
    const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
    const tagsData: Array<Tag> = ResponseService.tagsList(answers, question);
    (<SectionRanking>this._section.content).values = [];

    tagsData.slice(0, 3).forEach((tag, index) => {
      (<SectionRanking>this._section.content).values.push({
        occurrence: tag.count + 'X',
        name: this._multilingPipe.transform(tag.label, this.reportLang)
      })
    });

  }

  private _setPieData() {

  }

  private _getQuestion(id: string): Question {
    const index = this.questions.findIndex((ques) => ques._id === id);
    if (index !== -1) {
      return this.questions[index];
    }
  }

  get section(): ExecutiveSection {
    return this._section;
  }

  get questionType(): Array<{ label: string; alias: string }> {
    return this._questionType;
  }

}


