import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Question } from '../../../../../models/question';
import { Answer } from '../../../../../models/answer';
import { TranslateNotificationsService } from '../../../../../services/translate-notifications/translate-notifications.service';
import { TranslationService } from '../../../../../services/translation/translation.service';
import { AnswerService } from '../../../../../services/answer/answer.service';
import { Tag } from '../../../../../models/tag';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { MissionQuestionService } from '../../../../../services/mission/mission-question.service';
import {MissionQuestion} from '../../../../../models/mission';
import {KeyValue} from "@angular/common";

@Component({
  selector: 'app-answer-question',
  templateUrl: 'answer-question.component.html',
  styleUrls: ['answer-question.component.scss']
})

export class AnswerQuestionComponent {

  @Input() projectId = '';

  @Input() question: Question | MissionQuestion = <Question>{};

  @Input() editMode = false;

  @Input() adminMode = false;

  @Input() set fullAnswer(value: Answer) {
    this._fullAnswer = value;

    if ((this.question.controlType === 'checkbox' || this.question.controlType === 'stars')
      && this._fullAnswer.answers && !this._fullAnswer.answers[this.question.identifier]) {
      this._fullAnswer.answers[this.question.identifier] = {};
    }

    this._commenting = !!(this._fullAnswer.answers && this._fullAnswer.answers[this.question.identifier + 'Comment']);
    this._showQuestionTranslation = false;
    this._showCommentTranslation = false;
  }

  @Input() currentLang = this.platformLang;

  @Output() fullAnswerChange: EventEmitter<Answer> = new EventEmitter<Answer>();

  private _commenting = false;

  private _fullAnswer: Answer = <Answer>{};

  private _showQuestionTranslation = false;

  private _showCommentTranslation = false;

  private _starCase: Array<string> = ['1', '2', '3', '4', '5'];

  private _isAddTag = false;

  private _tagToAdd: Tag = <Tag>{};

  orderKeyValue = (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {
    const aInt = parseInt(a.key); const bInt = parseInt(b.key);
    return aInt < bInt ? -1 : (bInt < aInt ? 1 : 0);
  }

  constructor(private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _answerService: AnswerService,
              private _deepl: TranslationService) {
  }


  public updateQuality(object: { key: string, value: 0 | 1 | 2 }) {
    this.fullAnswer.answers[object.key + 'Quality'] = object.value;
    this.emitChanges();
  }

  public link(domain: string): string {
    return 'http://www.' + domain;
  }

  public emitChanges() {
    this.fullAnswerChange.emit(this.fullAnswer);
  }

  public optionLabel(identifier: string) {
    const option = _.find(this.question.options, (o: any) => o.identifier === identifier);
    return MissionQuestionService.label(option, 'label', this.currentLang);
  }

  public selectOption(event: Event, option: any) {
    event.preventDefault();
    this.emitChanges();

    if (option.identifier === this.fullAnswer.answers[this.question.identifier]) {
      this.fullAnswer.answers[this.question.identifier] = true;

    } else if (option.identifier !== this.fullAnswer.answers[this.question.identifier]){
      this.fullAnswer.answers[this.question.identifier] = option.identifier;
    }

  }

  public setAnswer(event: any) {
    this.fullAnswer.answers[this.question.identifier] = event.value;
    this.emitChanges();
  }

  public addTag(tag: Tag, q_identifier: string): void {
    this._answerService.addTag(this.fullAnswer._id, tag, q_identifier)
      .pipe(first())
      .subscribe((tagResult: Tag) => {
        if (this.fullAnswer.answerTags[q_identifier]) {
          this.fullAnswer.answerTags[q_identifier].push(tagResult);
        } else {
          this.fullAnswer.answerTags[q_identifier] = [tagResult];
        }
        this._translateNotificationsService.success('Success', 'The tag is added to the answer.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Error', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
  }

  public createTag(tag: Tag, q_identifier: string): void {
    this._answerService.addTag(this.fullAnswer._id, tag, q_identifier)
      .pipe(first())
      .subscribe((newTag: Tag) => {
        if (this.fullAnswer.answerTags[q_identifier]) {
          this.fullAnswer.answerTags[q_identifier].push(newTag);
        } else {
          this.fullAnswer.answerTags[q_identifier] = [newTag];
        }
        this._translateNotificationsService.success('Success', 'The tag is created and added to the answer.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Error', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
  }

  public removeTag(tag: Tag, q_identifier: string): void {
    this._answerService.removeTag(this.fullAnswer._id, tag._id, q_identifier)
      .pipe(first())
      .subscribe((a: any) => {
        this.fullAnswer.answerTags[q_identifier] = this.fullAnswer.answerTags[q_identifier].filter(t => t._id !== tag._id);
        this._translateNotificationsService.success('Success', 'The tag is removed from the answer.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
  }

  public answerTags(identifier: string): Array<any> {
    return this.fullAnswer.answerTags && this.fullAnswer.answerTags[identifier]
      ? this.fullAnswer.answerTags[identifier] : [];
  }

  set showQuestionTranslation(value: boolean) {
    if (!!value) {
      try {
        if (this._fullAnswer.answers_translations[this.question.identifier][this.platformLang]) {
          this._showQuestionTranslation = true;
        } else {
          throw new Error('no translation');
        }
      } catch (err) {
        if (!this._fullAnswer.answers_translations[this.question.identifier]) {
          this._fullAnswer.answers_translations[this.question.identifier] = {};
        }
        this._deepl.translate(this._fullAnswer.answers[this.question.identifier], this.platformLang)
          .pipe(first())
          .subscribe((_value) => {
            this._fullAnswer.answers_translations[this.question.identifier][this.platformLang] = _value.translation;
            this._showQuestionTranslation = true;
            const objToSave = {answers_translations: {[this.question.identifier]: {[this.platformLang]: _value.translation}}};
            this._answerService.save(this._fullAnswer._id, objToSave).pipe(first()).subscribe(() => {
            });
          }, (err: HttpErrorResponse) => {
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
            //TODO all errors should be sent to the back for tracking.
          });
      }
    } else {
      this._showQuestionTranslation = false;
    }
  }

  get showQuestionTranslation(): boolean {
    return this._showQuestionTranslation;
  }

  set showCommentTranslation(value: boolean) {
    if (!!value) {
      try {
        if (this._fullAnswer.answers_translations[this.question.identifier + 'Comment'][this.platformLang]) {
          this._showCommentTranslation = true;
        } else {
          throw new Error('no translation');
        }
      } catch (err) {
        if (!this._fullAnswer.answers_translations[this.question.identifier + 'Comment']) {
          this._fullAnswer.answers_translations[this.question.identifier + 'Comment'] = {};
        }
        this._deepl.translate(this._fullAnswer.answers[this.question.identifier + 'Comment'],
          this.platformLang)
          .pipe(first())
          .subscribe((_value) => {
            this._fullAnswer.answers_translations[this.question.identifier + 'Comment'][this.platformLang] = _value.translation;
            this._showCommentTranslation = true;
            const objToSave = {
              answers_translations: {
                [this.question.identifier + 'Comment']:
                  {[this.platformLang]: _value.translation}
              }
            };
            this._answerService.save(this._fullAnswer._id, objToSave).pipe(first()).subscribe(() => {
            });
          }, (err: HttpErrorResponse) => {
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
            console.error(err);
          });
      }
    } else {
      this._showCommentTranslation = false;
    }
  }

  moveListElement(questionId: string, initialIndex: number) {
    const emptyRanking = this.fullAnswer.answers[questionId][0] === null;
    const selectElem = document.getElementById(`select-${questionId}-${initialIndex}`) as HTMLSelectElement;
    if (selectElem) {
      const targetIndex = selectElem.selectedIndex;
      const keys = Object.keys(this.fullAnswer.answers[questionId]);
      const values = (emptyRanking) ? keys : Object.values(this.fullAnswer.answers[questionId]);
      values.splice(targetIndex, 0, values.splice(initialIndex, 1)[0]);
      keys.map(x => {
        this.fullAnswer.answers[questionId][x] = values[x];
      });
      this.emitChanges();
    }
  }

  performAction(event: any, identifier: string, tag?: any) {
    switch (event.action) {
      case 'add':
        this.addTag(event.value, identifier);
        this._isAddTag = false;
        break;
      case 'create':
        this.createTag(event.value, identifier);
        this._isAddTag = false;
        break;
      case 'delete':
        this.removeTag(tag, identifier);
        break;
      case 'cancel':
        this._isAddTag = false;
        break;
    }
  }

  showAddTag() {
    this._isAddTag = true;
  }

  get showCommentTranslation(): boolean {
    return this._showCommentTranslation;
  }

  get fullAnswer(): Answer {
    return this._fullAnswer;
  }

  get commenting(): boolean {
    return this._commenting;
  }

  set commenting(val: boolean) {
    this._commenting = val;
  }

  get starCase(): Array<string> {
    return this._starCase;
  }

  get isAddTag(): boolean {
    return this._isAddTag;
  }

  get tagToAdd(): Tag {
    return this._tagToAdd;
  }

  get platformLang(): string {
    return this._translateService.currentLang;
  }

  get questionLabel(): string {
    return MissionQuestionService.label(this.question, 'label', this.currentLang);
  }
}
