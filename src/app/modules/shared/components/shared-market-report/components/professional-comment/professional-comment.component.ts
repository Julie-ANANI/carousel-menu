import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../../../../../services/translation/translation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import {AnswerService} from "../../../../../../services/answer/answer.service";

@Component({
  selector: 'app-market-comment',
  templateUrl: 'professional-comment.component.html',
  styleUrls: ['professional-comment.component.scss']
})

export class SharedMarketCommentComponent {

  @Input() answer: Answer;

  @Input() questionId: string;

  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(private answerService: AnswerService,
              private translateService: TranslateService,
              private translateNotificationsService: TranslateNotificationsService,
              private deepl: TranslationService) {
  }

  private _showTranslation = false;

  public seeAnswer(answer: Answer) {
    this.modalAnswerChange.emit(answer);
  }

  set showTranslation(value: boolean) {
    if (!!value) {
      try {
        if (this.answer.answers_translations[this.questionId][this.currentLang]) {
          this._showTranslation = true;
        } else {
          throw new Error('no translation');
        }
      } catch (_err) {
        if (!this.answer.answers_translations[this.questionId]) {
          this.answer.answers_translations[this.questionId] = {};
        }
        this.deepl.translate(this.answer.answers[this.questionId], this.currentLang).subscribe((value) => {
          this.answer.answers_translations[this.questionId][this.currentLang] = value.translation;
          this._showTranslation = true;
          const objToSave = {answers_translations: {[this.questionId]: {[this.currentLang]: value.translation}}};
          this.answerService.save(this.answer._id, objToSave).subscribe((value) => {});
        }, (_e) => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
        });
      }
    } else {
      this._showTranslation = false;
    }
  }

  get showTranslation(): boolean {
    return this._showTranslation;
  }

  get currentLang(): string {
    return this.translateService.currentLang;
  }

}
