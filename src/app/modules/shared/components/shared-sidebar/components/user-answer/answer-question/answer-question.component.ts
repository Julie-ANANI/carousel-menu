import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Question } from '../../../../../../../models/question';
import { Answer } from '../../../../../../../models/answer';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { AnswerService } from '../../../../../../../services/answer/answer.service';
import { Tag } from '../../../../../../../models/tag';

@Component({
  selector: 'app-answer-question',
  templateUrl: 'answer-question.component.html',
  styleUrls: ['answer-question.component.scss']
})

export class AnswerQuestionComponent implements OnInit {

  @Input() innoid: string;
  @Input() question: Question;
  @Input() fullAnswer: Answer;
  @Input() editMode: boolean;
  @Input() adminMode: boolean;

  _commenting: boolean;

  constructor(private _translateService: TranslateService,
              private _notificationsService: TranslateNotificationsService,
              private _answerService: AnswerService) { }

  ngOnInit() {
    this._commenting = !!(this.fullAnswer.answers && this.fullAnswer.answers[this.question.identifier + 'Comment']);
  }

  updateQuality(object: {key: string, value: 0 | 1 | 2}) {
    this.fullAnswer.answers[object.key + 'Quality'] = object.value;
  }

  link(domain: string): string {
    return 'http://www.' + domain;
  }

  optionLabel(identifier: string) {
    const option = _.find(this.question.options, (o: any) => o.identifier === identifier);
    if (option && option.label) {
      return option.label[this.lang];
    } else {
      return undefined;
    }
  }

  checkOption(id: string, event: Event) {
    if (!this.fullAnswer.answers[this.question.identifier]) {
      this.fullAnswer.answers[this.question.identifier] = {};
    }
    this.fullAnswer.answers[this.question.identifier][id] = !this.fullAnswer.answers[this.question.identifier][id];
  }

  selectOption(event: Event, option: any) {
    event.preventDefault();
    this.fullAnswer.answers[this.question.identifier] = option.identifier;
  }

  setAnswer(event: any) {
    this.fullAnswer.answers[this.question.identifier] = event.value;
  }

  addComment(event: Event) {
    event.preventDefault();
    this._commenting = true;
    this.fullAnswer.answers[this.question.identifier + 'Comment'] = '';
  }

  deleteComment(event: Event) {
    event.preventDefault();
    delete this.fullAnswer.answers[this.question.identifier + 'Comment'];
  }

  public addTag(tag: Tag, q_identifier: string): void {
    this._answerService
      .addTag(this.fullAnswer._id, tag._id, q_identifier)
      .first()
      .subscribe((a) => {
        this.fullAnswer.answerTags[q_identifier].push(tag);
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
      });
  }

  public removeTag(tag: Tag, q_identifier: string): void {
    this._answerService
      .removeTag(this.fullAnswer._id, tag._id, q_identifier)
      .first()
      .subscribe((a) => {
        this.fullAnswer.answerTags[q_identifier] = this.fullAnswer.answerTags[q_identifier].filter(t => t._id !== tag._id);
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
      }, err => {
        this._notificationsService.error('ERROR.ERROR', err);
      });
  }

  public answerTags(identifier: string): Array<any> {
    return this.fullAnswer.answerTags && this.fullAnswer.answerTags[identifier] ? this.fullAnswer.answerTags[identifier] : [];
  }

  get lang (): string {
    return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
  }

  get commenting() {
    return this._commenting;
  }

}
