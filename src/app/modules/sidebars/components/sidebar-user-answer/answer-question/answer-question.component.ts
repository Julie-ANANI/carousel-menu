import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Question } from '../../../../../models/question';
import { Answer } from '../../../../../models/answer';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { TranslationService } from '../../../../../services/translation/translation.service';
import { AnswerService } from '../../../../../services/answer/answer.service';
import { Tag } from '../../../../../models/tag';
import { first} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import {MissionQuestionService} from '../../../../../services/mission/mission-question.service';

@Component({
  selector: 'app-answer-question',
  templateUrl: 'answer-question.component.html',
  styleUrls: ['answer-question.component.scss']
})

export class AnswerQuestionComponent {

  get questionLabel(): string {
    return MissionQuestionService.label(this.question, 'label', this.currentLang);
  }

  @Input() projectId = '';

  @Input() question: Question = <Question>{};

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

  @Output() fullAnswerChange: EventEmitter<Answer> = new EventEmitter<Answer>();

  private _commenting = false;

  private _fullAnswer: Answer = <Answer>{};

  private _showQuestionTranslation = false;

  private _showCommentTranslation = false;

  private _currentLang = this._translateService.currentLang;

  private _starCase: Array<string> = ['1', '2', '3', '4', '5'];

  constructor(private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _answerService: AnswerService,
              private _deepl: TranslationService) { }


  public updateQuality(object: {key: string, value: 0 | 1 | 2}) {
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
    this.fullAnswer.answers[this.question.identifier] = option.identifier;
    this.emitChanges();
  }

  public setAnswer(event: any) {
    this.fullAnswer.answers[this.question.identifier] = event.value;
    this.emitChanges();
  }

  public addTag(tag: Tag, q_identifier: string): void {
    this._answerService.addTag(this.fullAnswer._id, tag._id, q_identifier)
      .pipe(first())
      .subscribe((a: any) => {
        if (this.fullAnswer.answerTags[q_identifier]) {
          this.fullAnswer.answerTags[q_identifier].push(tag);
        } else {
          this.fullAnswer.answerTags[q_identifier] = [tag];
        }
        this._translateNotificationsService.success('Success' , 'The tag is added to the answer.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Error', 'The tag is already added to the answer.');
        console.error(err);
      });
  }

  public createTag(tag: Tag, q_identifier: string): void {
    this._answerService.createTag(this.fullAnswer._id, tag, q_identifier)
      .pipe(first())
      .subscribe((newTag: Tag) => {
        if (this.fullAnswer.answerTags[q_identifier]) {
          this.fullAnswer.answerTags[q_identifier].push(newTag);
        } else {
          this.fullAnswer.answerTags[q_identifier] = [newTag];
        }
        this._translateNotificationsService.success('Success' , 'The tag is created and added to the answer.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Error', 'The tag is already created/added to the answer.');
        console.error(err);
      });
  }

  public removeTag(tag: Tag, q_identifier: string): void {
    this._answerService.removeTag(this.fullAnswer._id, tag._id, q_identifier)
      .pipe(first())
      .subscribe((a: any) => {
        this.fullAnswer.answerTags[q_identifier] = this.fullAnswer.answerTags[q_identifier].filter(t => t._id !== tag._id);
        this._translateNotificationsService.success('Success' , 'The tag is removed from the answer.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
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
        if (this._fullAnswer.answers_translations[this.question.identifier][this._currentLang]) {
          this._showQuestionTranslation = true;
        } else {
          throw new Error('no translation');
        }
      } catch (err) {
        if (!this._fullAnswer.answers_translations[this.question.identifier]) {
          this._fullAnswer.answers_translations[this.question.identifier] = {};
        }
        this._deepl.translate(this._fullAnswer.answers[this.question.identifier], this._currentLang)
          .pipe(first())
          .subscribe((_value) => {
          this._fullAnswer.answers_translations[this.question.identifier][this._currentLang] = _value.translation;
          this._showQuestionTranslation = true;
          const objToSave = {answers_translations: {[this.question.identifier]: {[this._currentLang]: _value.translation}}};
          this._answerService.save(this._fullAnswer._id, objToSave).pipe(first()).subscribe(() => {});
        }, (err: HttpErrorResponse) => {
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
            console.error(err);
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
        if (this._fullAnswer.answers_translations[this.question.identifier + 'Comment'][this._currentLang]) {
          this._showCommentTranslation = true;
        } else {
          throw new Error('no translation');
        }
      } catch (err) {
        if (!this._fullAnswer.answers_translations[this.question.identifier + 'Comment']) {
          this._fullAnswer.answers_translations[this.question.identifier + 'Comment'] = {};
        }
        this._deepl.translate(this._fullAnswer.answers[this.question.identifier + 'Comment'],
          this._currentLang)
          .pipe(first())
          .subscribe((_value) => {
          this._fullAnswer.answers_translations[this.question.identifier + 'Comment'][this._currentLang] = _value.translation;
          this._showCommentTranslation = true;
          const objToSave = {answers_translations: {[this.question.identifier + 'Comment']:
                {[this._currentLang]: _value.translation}}};
          this._answerService.save(this._fullAnswer._id, objToSave).pipe(first()).subscribe(() => {});
        }, (err: HttpErrorResponse) => {
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
            console.error(err);
          });
      }
    } else {
      this._showCommentTranslation = false;
    }
  }

  moveListElement(questionId: string, event: any, initialIndex: number) {
    const selectElem = document.getElementById(`select-${questionId}-${initialIndex}`) as HTMLSelectElement;
    if (selectElem) {
      const targetIndex = selectElem.selectedIndex;
      this.fullAnswer.answers[questionId].splice(targetIndex, 0, this.fullAnswer.answers[questionId].splice(initialIndex, 1)[0]);
      this.emitChanges();
    }
  }

  get showCommentTranslation(): boolean {
    return this._showCommentTranslation;
  }

  get currentLang(): string {
    return this._currentLang;
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

}
