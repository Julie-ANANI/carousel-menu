import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Question } from '../../../../../models/question';
import { Answer } from '../../../../../models/answer';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { TranslationService } from '../../../../../services/translation/translation.service';
import { AnswerService } from '../../../../../services/answer/answer.service';
import { Tag } from '../../../../../models/tag';

@Component({
  selector: 'app-answer-question',
  templateUrl: 'answer-question.component.html',
  styleUrls: ['answer-question.component.scss']
})

export class AnswerQuestionComponent {

  @Input() innoid: string;

  @Input() question: Question;

  @Input() editMode: boolean;

  @Input() adminMode: boolean;

  @Input() set fullAnswer(value: Answer) {
    this._fullAnswer = value;
    if ((this.question.controlType === 'checkbox' || this.question.controlType === 'stars') && !this._fullAnswer.answers[this.question.identifier]) {
      this._fullAnswer.answers[this.question.identifier] = {};
    }
    this._commenting = !!(this._fullAnswer.answers && this._fullAnswer.answers[this.question.identifier + 'Comment']);
  }

  _commenting: boolean;

  _fullAnswer: Answer;

  private _showQuestionTranslation = false;

  private _showCommentTranslation = false;

  constructor(private _translateService: TranslateService,
              private _notificationsService: TranslateNotificationsService,
              private _answerService: AnswerService,
              private _deepl: TranslationService) { }

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

  selectOption(event: Event, option: any) {
    event.preventDefault();
    this.fullAnswer.answers[this.question.identifier] = option.identifier;
  }

  setAnswer(event: any) {
    this.fullAnswer.answers[this.question.identifier] = event.value;
  }

  public addTag(tag: Tag, q_identifier: string): void {
    this._answerService
      .addTag(this.fullAnswer._id, tag._id, q_identifier)
      .subscribe((a: any) => {
        if (this.fullAnswer.answerTags[q_identifier]) {
          this.fullAnswer.answerTags[q_identifier].push(tag);
        } else {
          this.fullAnswer.answerTags[q_identifier] = [tag];
        }
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, (err: any) => {
        this._notificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
      });
  }

  createTag(tag: Tag, q_identifier: string): void {
    this._answerService.createTag(this.fullAnswer._id, tag, q_identifier)
      .subscribe((newTag: Tag) => {
        if (this.fullAnswer.answerTags[q_identifier]) {
          this.fullAnswer.answerTags[q_identifier].push(newTag);
        } else {
          this.fullAnswer.answerTags[q_identifier] = [newTag];
        }
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, (err: any) => {
        this._notificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
      });
  }

  public removeTag(tag: Tag, q_identifier: string): void {
    this._answerService
      .removeTag(this.fullAnswer._id, tag._id, q_identifier)
      .subscribe((a: any) => {
        this.fullAnswer.answerTags[q_identifier] = this.fullAnswer.answerTags[q_identifier].filter(t => t._id !== tag._id);
        this._notificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
      }, (err: any) => {
        this._notificationsService.error('ERROR.ERROR', err.message);
      });
  }

  public answerTags(identifier: string): Array<any> {
    return this.fullAnswer.answerTags && this.fullAnswer.answerTags[identifier] ? this.fullAnswer.answerTags[identifier] : [];
  }

  set showQuestionTranslation(value: boolean) {
    if (!!value) {
      try {
        if (this._fullAnswer.answers_translations[this.question.identifier][this.lang]) {
          this._showQuestionTranslation = true;
        } else {
          throw new Error('no translation');
        }
      } catch (_err) {
        if (!this._fullAnswer.answers_translations[this.question.identifier]) {
          this._fullAnswer.answers_translations[this.question.identifier] = {};
        }
        this._deepl.translate(this._fullAnswer.answers[this.question.identifier], this.lang).subscribe((value) => {
          this._fullAnswer.answers_translations[this.question.identifier][this.lang] = value.translation;
          this._showQuestionTranslation = true;
          const objToSave = {answers_translations: {[this.question.identifier]: {[this.lang]: value.translation}}};
          this._answerService.save(this._fullAnswer._id, objToSave).subscribe((value) => {});
        }, (_e) => {
          this._notificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
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
        if (this._fullAnswer.answers_translations[this.question.identifier + 'Comment'][this.lang]) {
          this._showCommentTranslation = true;
        } else {
          throw new Error('no translation');
        }
      } catch (_err) {
        if (!this._fullAnswer.answers_translations[this.question.identifier + 'Comment']) {
          this._fullAnswer.answers_translations[this.question.identifier + 'Comment'] = {};
        }
        this._deepl.translate(this._fullAnswer.answers[this.question.identifier + 'Comment'], this.lang).subscribe((value) => {
          this._fullAnswer.answers_translations[this.question.identifier + 'Comment'][this.lang] = value.translation;
          this._showCommentTranslation = true;
          const objToSave = {answers_translations: {[this.question.identifier + 'Comment']: {[this.lang]: value.translation}}};
          this._answerService.save(this._fullAnswer._id, objToSave).subscribe((value) => {});
        }, (_e) => {
          this._notificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
        });
      }
    } else {
      this._showCommentTranslation = false;
    }
  }

  get showCommentTranslation(): boolean {
    return this._showCommentTranslation;
  }

  get lang (): string {
    return this._translateService.currentLang;
  }

  get fullAnswer() { return this._fullAnswer; }

  get commenting() {
    return this._commenting;
  }

  set commenting(val: boolean) {
    this._commenting = val;
  }

}
