import { Component, Input, OnInit} from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { Question } from '../../../../../models/question';
import { ResponseService } from '../../shared-market-report/services/response.service';
import { Innovation } from '../../../../../models/innovation';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Tag } from '../../../../../models/tag';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-executive-section',
  templateUrl: './executive-section.component.html',
  styleUrls: ['./executive-section.component.scss']
})

export class ExecutiveSectionComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._innovation = value;
    this._getQuestions(value);
  }

  @Input() set section(value: number) {
    this._sectionNumber = value;
  }

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this._getSectionInformation(this._sectionNumber);
  }

  private _answers: Array<Answer> = [];

  private _answersToShow: Array<Answer> = [];

  private _innovation: Innovation;

  private _sectionMenuOptions: Array<Question> = [];

  private _questions: Array<Question> = [];

  private _sectionNumber: number;

  private _questionSelected: Question;

  private _abstractValue = '';

  private _adminSide: boolean;

  private _stats: { nbAnswers?: number, percentage?: number };

  private _tags: Array<Tag> = [];

  constructor(private _responseService: ResponseService,
              private _location: Location,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._adminSide = this._location.path().slice(5, 11) === '/admin';

  }

  ngOnInit() { }


  /***
   * This function is to get the questions from the service, and then push it into the
   * respective arrays.
   * @param {Innovation} value
   */
  private _getQuestions(value: Innovation) {
    if (value.preset && value.preset.sections) {
      this._responseService.getPresets(value).forEach((questions) => {
        const index = this._questions.findIndex((question) => question._id === questions._id);
        if (index === -1) {
          this._questions.push(questions);
          this._sectionMenuOptions.push(questions);
        }
      });
    }
  }


  /***
   * This function is called when the operator clicked on anyone title
   * then we select that question and save that question id.
   * @param {Event} event
   * @param {Question} option
   */
  public onTitleClicked(event: Event, option: Question) {
    this._innovation.executiveReport.sections[this._sectionNumber] = { quesId: option._id };

    this._innovationService.save(this._innovation._id, this._innovation).subscribe(() => {
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });

    this._getSectionInformation(this._sectionNumber);
  }


  /***
   * Based on the sectionNumber we get the question id from the executiveReport.sections array and fill that section
   * with all the details.
   * @param {number} sectionNumber
   */
  private _getSectionInformation(sectionNumber: number) {

    if (this._innovation.executiveReport.sections[sectionNumber]) {

      this._questionSelected = this._questions.find((ques) => ques._id === this._innovation.executiveReport.sections[sectionNumber].quesId);

      if (this._questionSelected) {

        this._answersToShow = this._responseService.getAnswersToShow(this._answers, this._questionSelected);

        this._stats = {
          nbAnswers: this._answersToShow.length,
          percentage: Math.round((this._answersToShow.length * 100) / this._answers.length)
        };

        this._getAbstractValue();

        this._getTags();

      }

    }

  }


  /***
   * this function is to get the abstract value from the abstracts array by using
   * quesId.
   */
  private _getAbstractValue() {

    this._abstractValue = '';

    if (this._innovation.executiveReport.abstracts) {
      const findAbstract = this._innovation.executiveReport.abstracts.find((ques) => ques.quesId === this._questionSelected._id);
      if (findAbstract) {
        this._abstractValue = findAbstract.value;
      }
    }

  }


  /***
   * this functions is to get the tags list for the particular question.
   */
  private _getTags() {
    this._tags = ResponseService.getTagsList(this._answers, this._questionSelected);
  }


  /***
   * this function is to get the background color for the tags based on
   * the title of the question.
   * @param identifier
   */
  public color(identifier: string): string {
    if (identifier.toLowerCase() === 'objections') {
      return '#EA5858';
    } else if (identifier.toLowerCase() === 'points forts' || identifier.toLowerCase() === 'strengths') {
      return '#2ECC71';
    } else {
      return '#4F5D6B';
    }
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get answersToShow(): Array<Answer> {
    return this._answersToShow;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get sectionMenuOptions(): Array<Question> {
    return this._sectionMenuOptions;
  }

  get questions(): Array<Question> {
    return this._questions;
  }

  get sectionNumber(): number {
    return this._sectionNumber;
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
    return this._tags;
  }

}


