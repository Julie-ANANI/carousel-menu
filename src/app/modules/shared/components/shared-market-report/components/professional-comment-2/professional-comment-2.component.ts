import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Answer} from '../../../../../../models/answer';
import {AnswerService} from '../../../../../../services/answer/answer.service';
import {DataService} from '../../services/data.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslateNotificationsService} from '../../../../../../services/translate-notifications/translate-notifications.service';
import {Question} from '../../../../../../models/question';
import {Tag} from '../../../../../../models/tag';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {UserFrontService} from '../../../../../../services/user/user-front.service';
import {TranslationService} from '../../../../../../services/translation/translation.service';
import {Multiling} from '../../../../../../models/multiling';
import {MissionQuestion} from '../../../../../../models/mission';

@Component({
  selector: 'app-market-comment-2',
  templateUrl: 'professional-comment-2.component.html',
  styleUrls: ['professional-comment-2.component.scss']
})

export class SharedMarketComment2Component {

  @Input() answer: Answer = <Answer>{};

  @Input() canEditQuestionTags = false;

  @Input() question: Question | MissionQuestion = <Question | MissionQuestion>{};

  @Input() reportingLang = this._translateService.currentLang;

  @Output() modalAnswerChange = new EventEmitter<any>();

  private _currentLang = this._translateService.currentLang;

  private _translation: Multiling = {};

  private _showTranslation = false;

  constructor(private _answerService: AnswerService,
              private _dataService: DataService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _deepl: TranslationService) { }

  public translate(lang: string) {

    // We already have translated before
    if (this._translation && this._translation[lang]) {
      this._showTranslation = true;
    } else {
      this._deepl.translate(this.answer.answers[this.questionId], lang)
        .pipe(first())
        .subscribe((value) => {
          this._translation[lang] = value.translation;
          this._showTranslation = true;
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        });
    }
  }

  public seeAnswer(answer: Answer) {
    this.modalAnswerChange.emit(answer);
  }

  public addTag(tag: Tag): void {
    this._answerService.addTag(this.answer._id, tag._id, this.questionId).pipe(first()).subscribe((a: any) => {
      if (this.answer.answerTags[this.questionId]) {
        this.answer.answerTags[this.questionId].push(tag);
      } else {
        this.answer.answerTags[this.questionId] = [tag];
      }
      this._dataService.updateTagsList(this.question);
      this._translateNotificationsService.success('Success' , 'The tag has been added.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public createTag(tag: Tag): void {
    this._answerService.createTag(this.answer._id, tag, this.questionId).pipe(first()).subscribe((newTag: any) => {
      if (this.answer.answerTags[this.questionId]) {
        this.answer.answerTags[this.questionId].push(newTag);
      } else {
        this.answer.answerTags[this.questionId] = [newTag];
      }
      this._dataService.updateTagsList(this.question);
      this._translateNotificationsService.success('Success' , 'The tag has been added.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public removeTag(tag: Tag): void {
    this._answerService.removeTag(this.answer._id, tag._id, this.questionId).pipe(first()).subscribe((a: any) => {
      this.answer.answerTags[this.questionId] = this.answer.answerTags[this.questionId].filter(t => t._id !== tag._id);
      this._dataService.updateTagsList(this.question);
      this._translateNotificationsService.success('Success' , 'The tag has been removed.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  get professionalName(): string {
    return UserFrontService.fullName(this.answer && this.answer.professional);
  }

  get answerTags(): Array<any> {
    return this.answer.answerTags[this.questionId] ? this.answer.answerTags[this.questionId] : [];
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get questionId(): string {
    return this.question.controlType === 'textarea' ? this.question.identifier : this.question.identifier + 'Comment';
  }

  get translation(): Multiling {
    return this._translation;
  }

  set translation(value: Multiling) {
    this._translation = value;
  }

  get showTranslation(): boolean {
    return this._showTranslation;
  }

  set showTranslation(value: boolean) {
    this._showTranslation = value;
  }
}
