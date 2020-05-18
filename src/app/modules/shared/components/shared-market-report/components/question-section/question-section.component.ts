import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Question } from '../../../../../../models/question';
import { Innovation } from '../../../../../../models/innovation';
import { Tag } from '../../../../../../models/tag';
import { ResponseService } from '../../services/response.service';
import { Location } from '@angular/common';
import { InnovationFrontService } from '../../../../../../services/innovation/innovation-front.service';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-question-section',
  templateUrl: 'question-section.component.html',
  styleUrls: ['question-section.component.scss']
})

export class QuestionSectionComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  @Input() set answers(value: Array<Answer>) {
    this._answersReceived = value;
    this._updateAnswersData();
  }

  @Input() set toggleAnswers(value: boolean) {
    this._toggleAnswers = value;
    this._showComment = value;
  }

  @Input() set readonly(value: boolean) {
    this._readonly = value;
  }

  @Input() set question(value: Question) {
    this._questionReceived = value;
  }

  @Input() selectedTag: any;

  @Output() modalAnswerChange = new EventEmitter<any>();

  @Output() executiveTags = new EventEmitter<Array<Tag>>();

  private _innovation: Innovation = {};

  private _answersReceived: Array<Answer> = [];

  private _questionReceived: Question;

  private _adminSide: boolean;

  private _toggleAnswers: boolean = false;

  private _answersWithComment: Array<Answer> = [];

  private _readonly: boolean;

  private _stats: {nbAnswers?: number, percentage?: number};

  private _showComment: boolean;

  constructor(private _translateService: TranslateService,
              private _responseService: ResponseService,
              private _location: Location,
              private _dataService: DataService) {

    this._adminSide = this._location.path().slice(5, 11) === '/admin';

  }

  ngOnInit() {
    /* Update Answers Data */
    this._updateAnswersData();
  }


  private _updateAnswersData() {
    if (this._questionReceived && this._questionReceived.identifier) {
      const id = this._questionReceived.identifier;

      const answersToShow = this._responseService.answersToShow(this._answersReceived, this._questionReceived);
      this._dataService.setAnswers(this._questionReceived, answersToShow);

      // filter comments
      switch (this._questionReceived.controlType) {
          case 'checkbox':
          this._answersWithComment = this._answersReceived.filter(function(a) {
            return !(a.answers[id] && Object.keys(a.answers[id]).some((k) => a.answers[id][k]))
              && a.answers[id + 'Comment']
              && a.answers[id + 'CommentQuality'] !== 0;
          });
          break;

          case 'radio':
          this._answersWithComment = this._answersReceived.filter(function(a) {
            return !a.answers[id]
            && a.answers[id + 'Comment']
            && a.answers[id + 'CommentQuality'] !== 0;
          });
          break;

          default:
          this._answersWithComment = this._answersReceived.filter(function(a) {
            return a.answers[id + 'Comment']
              && a.answers[id + 'CommentQuality'] !== 0;
          });
      }

      // sort comments
      this._answersWithComment = this._answersWithComment.sort((a, b) => {
          if ((b.answers[id + 'CommentQuality'] || 1) - (a.answers[id + 'CommentQuality'] || 1) === 0) {
            return b.answers[id + 'Comment'].length - a.answers[id + 'Comment'].length;
          } else {
            return (b.answers[id + 'CommentQuality'] || 1) - (a.answers[id + 'CommentQuality'] || 1);
          }
        });

      this._stats = {
        nbAnswers: answersToShow.length,
        percentage: Math.round((answersToShow.length * 100) / this._answersReceived.length)
      };

    }
  }


  public updateNumberOfItems(event: number): void {
    this._stats = {...this._stats, nbAnswers: event};
  }


  public seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }


  public answerBtnClicked(event: boolean) {
    this._showComment = event;
  }


  public color(length: number, limit: number) {
    return InnovationFrontService.getColor(length, limit);
  }

  get showComment(): boolean {
    return this._showComment;
  }

  get readonly(): boolean {
    return this._readonly;
  }

  get toggleAnswers(): boolean {
    return this._toggleAnswers;
  }

  get answersToShow(): Observable<Array<Answer>> {
    return this._dataService.getAnswers(this._questionReceived);
  }

  get answersWithComment(): Array<Answer> {
    return this._answersWithComment;
  }

  get stats() {
    return this._stats;
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get questionReceived(): Question {
    return this._questionReceived;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

}
