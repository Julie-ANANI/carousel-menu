import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { DataService } from '../../services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Question } from '../../../../../../models/question';
import { Tag } from '../../../../../../models/tag';

@Component({
  selector: 'app-market-comment-2',
  templateUrl: 'professional-comment-2.component.html',
  styleUrls: ['professional-comment-2.component.scss']
})

export class SharedMarketComment2Component {

  @Input() answer: Answer;

  @Input() canEditTags: boolean;

  @Input() question: Question;

  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(private answerService: AnswerService,
              private dataService: DataService,
              private translateService: TranslateService,
              private translateNotificationsService: TranslateNotificationsService) { }

  public seeAnswer(answer: Answer) {
    this.modalAnswerChange.emit(answer);
  }

  public addTag(tag: Tag): void {
    this.answerService
      .addTag(this.answer._id, tag._id, this.questionId)
      .subscribe((a: any) => {
        if (this.answer.answerTags[this.questionId]) {
          this.answer.answerTags[this.questionId].push(tag);
        } else {
          this.answer.answerTags[this.questionId] = [tag];
        }
        this.dataService.updateTagsList(this.question);
        this.translateNotificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, (err: any) => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
      });
  }

  createTag(tag: Tag): void {
    this.answerService.createTag(this.answer._id, tag, this.questionId)
      .subscribe((newTag: any) => {
        if (this.answer.answerTags[this.questionId]) {
          this.answer.answerTags[this.questionId].push(newTag);
        } else {
          this.answer.answerTags[this.questionId] = [newTag];
        }
        this.dataService.updateTagsList(this.question);
        this.translateNotificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.ADDED');
      }, (err: any) => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
      });
  }

  public removeTag(tag: Tag): void {
    this.answerService
      .removeTag(this.answer._id, tag._id, this.questionId)
      .subscribe((a: any) => {
        this.answer.answerTags[this.questionId] = this.answer.answerTags[this.questionId].filter(t => t._id !== tag._id);
        this.dataService.updateTagsList(this.question);
        this.translateNotificationsService.success('ERROR.TAGS.UPDATE' , 'ERROR.TAGS.REMOVED');
      }, (err: any) => {
        this.translateNotificationsService.error('ERROR.ERROR', err.message);
      });
  }

  get answerTags(): Array<any> {
    return this.answer.answerTags[this.questionId] ? this.answer.answerTags[this.questionId] : [];
  }

  get currentLang(): string {
    return this.translateService.currentLang;
  }

  get questionId(): string {
    return this.question.controlType === 'textarea' ? this.question.identifier : this.question.identifier + 'Comment';
  }

}
