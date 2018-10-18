import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from '../../services/filters.service';
import { Answer } from '../../../../../../models/answer';
import { Question } from '../../../../../../models/question';
import { Innovation } from '../../../../../../models/innovation';
import { Tag } from '../../../../../../models/tag';
import { ResponseService } from '../../services/response.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Location } from '@angular/common';
import {InnovationCommonService} from '../../../../../../services/innovation/innovation-common.service';

@Component({
  selector: 'app-question-section',
  templateUrl: 'question-section.component.html',
  styleUrls: ['question-section.component.scss']
})

export class QuestionSectionComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this.innovation = value;
  }

  @Input() set answers(value: Array<Answer>) {
    this.answersReceived = value;
    this.updateAnswersData();
  }

  @Input() set showDetails(value: boolean) {
    this._showDetails = value;
    this._showComment = value;
  }

  @Input() set readonly(value: boolean) {
    this._readonly = value;
  }

  @Input() set question(value: Question) {
    this.questionReceived = value;
  }

  innovation: Innovation = {};

  answersReceived: Array<Answer> = [];

  questionReceived: Question;

  adminSide: boolean;

  formQuestionSection: FormGroup;

  private _showDetails: boolean;
  private _answersWithComment: Array<Answer> = [];
  private _answersToShow: Array<Answer> = [];
  private _readonly: boolean;
  private _tagId: string;
  private _tags: Array<Tag>;
  private _stats: {nbAnswers?: number, percentage?: number};
  private _showComment: boolean;

  @Input() selectedTag: any;

  @Output() modalAnswerChange = new EventEmitter<any>();

  @Output() executiveTags = new EventEmitter<Array<Tag>>();

  constructor(private translateService: TranslateService,
              private filterService: FilterService,
              private responseService: ResponseService,
              private location: Location,
              private formBuilder: FormBuilder,
              private innovationCommonService: InnovationCommonService) {}

  ngOnInit() {

    /***
     * this is to make visible abstract textarea.
     * @type {boolean}
     */
    this.adminSide = this.location.path().slice(0, 6) === '/admin';

    this.buildForm();

    this.patchForm();

    this._tagId = this.questionReceived.identifier + (this.questionReceived.controlType !== 'textarea' ? 'Comment' : '');

    this.updateAnswersData();

  }


  /***
   * Build the form using quesId.
   */
  private buildForm() {
    this.formQuestionSection = this.formBuilder.group({
      [this.questionReceived._id]: ['']
    });
  }


  /***
   * Patch the abstract value for each question.
   */
  private patchForm() {
    const value = this.responseService.getInnovationAbstract(this.innovation, this.questionReceived._id);
    this.formQuestionSection.get(this.questionReceived._id).setValue(value);
  }


  private updateAnswersData() {
    if (this.questionReceived && this.questionReceived.identifier) {
      const id = this.questionReceived.identifier;

      this._answersToShow = this.responseService.getAnswersToShow(this.answersReceived, this.questionReceived);

      this._tags = this.responseService.getTagsList(this._answersToShow, this.questionReceived);

      // filter comments
      switch (this.questionReceived.controlType) {
          case 'checkbox':
          this._answersWithComment = this.answersReceived.filter(function(a) {
            return !(a.answers[id] && Object.keys(a.answers[id]).some((k) => a.answers[id][k]))
              && a.answers[id + 'Comment']
              && a.answers[id + 'CommentQuality'] !== 0;
          });
          break;

          case 'radio':
          this._answersWithComment = this.answersReceived.filter(function(a) {
            return !a.answers[id]
            && a.answers[id + 'Comment']
            && a.answers[id + 'CommentQuality'] !== 0
          });
          break;

          default:
          this._answersWithComment = this.answersReceived.filter(function(a) {
            return a.answers[id + 'Comment']
              && a.answers[id + 'CommentQuality'] !== 0
          });
      }

      // sort comments
      this._answersWithComment = this._answersWithComment
        .sort((a, b) => {
          if ((b.answers[id + 'CommentQuality'] || 1) - (a.answers[id + 'CommentQuality'] || 1) === 0) {
            return b.answers[id + 'Comment'].length - a.answers[id + 'Comment'].length;
          } else {
            return (b.answers[id + 'CommentQuality'] || 1) - (a.answers[id + 'CommentQuality'] || 1);
          }
        });

      this._stats = {
        nbAnswers: this._answersToShow.length,
        percentage: Math.round((this._answersToShow.length * 100) / this.answersReceived.length)
      };

    }
  }

  updateNumberOfItems(event: number): void {
    this._stats = {...this._stats, nbAnswers: event};
  }

  seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }

  answerBtnClicked(event: boolean) {
    this._showComment = event;
  }

  addTagFilter(event: Event, tag: Tag) {
    event.preventDefault();
    this.filterService.addFilter({
      status: 'TAG',
      questionId: this._tagId,
      questionTitle: tag.label,
      value: tag._id
    });
  }


  /***
   * This function is to save the abstract in the innovation object.
   * @param {Event} event
   * @param {string} formControlName
   */
  saveAbstract(event: Event, formControlName: string) {
    const abstract = this.formQuestionSection.get(formControlName).value;
    this.innovation = this.responseService.saveInnovationAbstract(this.innovation, abstract, formControlName);
    this.innovationCommonService.saveInnovation(this.innovation);
  }


  /***
   * This function returns the color according to the length of the input data.
   * @param {number} length
   * @param {number} limit
   * @returns {string}
   */
  getColor(length: number, limit: number) {
    return this.responseService.getColor(length, limit);
  }


  get showComment(): boolean {
    return this._showComment;
  }

  get readonly(): boolean {
    return this._readonly;
  }

  get showDetails(): boolean {
    return this._showDetails;
  }

  get answersToShow(): Array<Answer> {
    return this._answersToShow;
  }

  get answersWithComment(): Array<Answer> {
    return this._answersWithComment;
  }

  get stats() {
    return this._stats;
  }

  get tags() {
    return this._tags;
  }

  get lang(): string {
    return this.translateService.currentLang;
  }

}
