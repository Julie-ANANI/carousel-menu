import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Tag } from '../../../../../../models/tag';

@Component({
  selector: 'app-market-comment-2',
  templateUrl: 'professional-comment-2.component.html',
  styleUrls: ['professional-comment-2.component.scss']
})

export class SharedMarketComment2Component {

  @Input() answer: Answer;

  @Input() canEditTags: boolean;

  @Input() questionId: string;

  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(private answerService: AnswerService,
              private translateService: TranslateService,
              private translateNotificationsService: TranslateNotificationsService) { }

  public seeAnswer(answer: Answer) {
    this.modalAnswerChange.emit(answer);
  }

  public addTag(tag: Tag, q_identifier: string): void {
    this.answerService
      .addTag(this.answer._id, tag._id, q_identifier)
      .subscribe((a: any) => {
        if (this.answer.answerTags[q_identifier]) {
          this.answer.answerTags[q_identifier].push(tag);
        } else {
          this.answer.answerTags[q_identifier] = [tag];
        }
        this.translateNotificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, (err: any) => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
      });
  }

  createTag(tag: Tag, q_identifier: string): void {
    this.answerService.createTag(this.answer._id, tag, q_identifier)
      .subscribe((a: any) => {
        if (this.answer.answerTags[q_identifier]) {
          this.answer.answerTags[q_identifier].push(tag);
        } else {
          this.answer.answerTags[q_identifier] = [tag];
        }
        this.translateNotificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, (err: any) => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
      });
  }

  public removeTag(tag: Tag, q_identifier: string): void {
    this.answerService
      .removeTag(this.answer._id, tag._id, q_identifier)
      .subscribe((a: any) => {
        this.answer.answerTags[q_identifier] = this.answer.answerTags[q_identifier].filter(t => t._id !== tag._id);
        this.translateNotificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
      }, (err: any) => {
        this.translateNotificationsService.error('ERROR.ERROR', err.message);
      });
  }

  public answerTags(identifier: string): Array<any> {
    return this.answer.answerTags[identifier] ? this.answer.answerTags[identifier] : [];
  }

  get currentLang(): string {
    return this.translateService.currentLang;
  }

}
