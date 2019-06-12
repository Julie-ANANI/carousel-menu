import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../../../../models/question';
import { Answer } from '../../../../models/answer';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Tag } from '../../../../models/tag';
import { SidebarInterface } from '../../interfaces/sidebar-interface';

@Component({
  selector: 'app-user-answer',
  templateUrl: './user-answer.component.html',
  styleUrls: ['./user-answer.component.scss']
})

export class UserAnswerComponent {

  @Input() set sidebarState(value: SidebarInterface) {
    if (value === undefined || value === 'active') {
      this._reinitializeVariables();
    }
  }

  @Input() set projectId(value: string) {
    this._innovationId = value;
  }

  @Input() questions: Array<Question>;

  @Input() set userAnswer(value: Answer) {
    this._modalAnswer = value;
    if (this._modalAnswer && !this._modalAnswer.company) {
      this._modalAnswer.company = {};
    }
  }

  @Input() set adminMode(value: boolean) {
    this.modeAdmin = value;
  }

  @Output() answerUpdated = new EventEmitter<boolean>();

  private _modalAnswer: Answer;

  private _floor: any;

  private _editJob = false;

  private _editCompany = false;

  private _editCountry = false;

  private _editMode = false;

  private _innovationId = '';

  modeAdmin = false;

  constructor(private _translateService: TranslateService,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._floor = Math.floor;

  }


  private _reinitializeVariables() {
    this._editMode = false;
  }


  public resetEdit() {
    this._editJob = false;
    this._editCompany = false;
    this._editCountry = false;
  }


  public changeMode(event: Event) {
    if (event.target['checked']) {
      this._editMode = true;
    } else {
      this._editMode = false;
      this.resetEdit();
    }
  }


  public onClickEdit(activate: string) {

    switch (activate) {

      case 'country':
        this._editCountry = true;
        break;

      case 'job':
        this._editJob = true;
        break;

      case 'company':
        this._editCompany = true;
        break;

      default:
        //do nothing...

    }

  }


  public save(event: Event) {
    event.preventDefault();

    this.resetEdit();

    if (this._modalAnswer.professional.email) {
      // Hack : les réponses anciennes n'ont pas de champ quizReference,
      // mais il faut forcément une valeur pour sauvegarder la réponse
      // TODO: remove this hack
      this._modalAnswer.originalAnswerReference = this._modalAnswer.originalAnswerReference || 'oldQuiz';
      this._modalAnswer.quizReference = this._modalAnswer.quizReference || 'oldQuiz';

      this._answerService.save(this._modalAnswer._id, this._modalAnswer).subscribe(() => {
        this._translateNotificationsService.success('ERROR.ACCOUNT.UPDATE', 'ERROR.ANSWER.UPDATED');
        this.answerUpdated.emit(true);
        }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });
    }

  }


  public updateProfileQuality(object: {value: number}) {
    this._modalAnswer.profileQuality = object.value;
  }


  public updateCountry(event: {value: Array<any>}) {
    this._modalAnswer.country = event.value[0];
  }


  public updateStatus(event: Event, status: any) {
    event.preventDefault();

    if (this._editMode) {
      this._modalAnswer.status = status;
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.NOT_MODIFIED.USER_ANSWER');
    }

  }


  public sendEmail(event: Event, status: any) {
    if (event.target['checked']) {
      this.updateStatus(event, status);
    } else {
      this.updateStatus(event, 'VALIDATED_NO_MAIL');
    }
  }


  public addTag(tag: Tag): void {
    this._answerService.addTag(this._modalAnswer._id, tag._id).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.ADDED');
      this._modalAnswer.tags.push(tag);
      this.answerUpdated.emit(true);
      }, (err: any) => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
    });
  }


  public createTag(tag: Tag): void {
    this._answerService.createTag(this._modalAnswer._id, tag).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.ADDED');
      this._modalAnswer.tags.push(tag);
      this.answerUpdated.emit(true);
      }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
    });
  }


  public removeTag(tag: Tag): void {
    this._answerService.removeTag(this._modalAnswer._id, tag._id).subscribe((a: any) => {
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.REMOVED');
      this._modalAnswer.tags = this._modalAnswer.tags.filter(t => t._id !== tag._id);
      this.answerUpdated.emit(true);
      }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  public importAnswer(event: Event): void {
    event.preventDefault();

    this._answerService.importFromQuiz(this._modalAnswer).subscribe((_res: any) => {
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.ANSWER.IMPORTED');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }

  get meta(): any {
    return this._modalAnswer['meta'] || {};
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get modalAnswer(): Answer {
    return this._modalAnswer;
  }

  get floor(): any {
    return this._floor;
  }

  get editJob(): boolean {
    return this._editJob;
  }

  get editCompany(): boolean {
    return this._editCompany;
  }

  get editCountry(): boolean {
    return this._editCountry;
  }

  get editMode(): boolean {
    return this._editMode;
  }

  get innovationId(): string {
    return this._innovationId;
  }

  get mailType(): string {
    return this._modalAnswer.mailType;
  }

  get autoTags(): Array<string> {
    return this._modalAnswer.autoTags;
  }

}
