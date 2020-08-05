import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../../../../models/question';
import { Answer } from '../../../../models/answer';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Tag } from '../../../../models/tag';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { Company } from '../../../../models/company';
import * as momentTimeZone from 'moment-timezone';
import { first } from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../services/error/error-front.service';
import {NewPro} from './reassign-answer/reassign-answer.component';
import {UserFrontService} from '../../../../services/user/user-front.service';

@Component({
  selector: 'app-sidebar-user-answer',
  templateUrl: './sidebar-user-answer.component.html',
  styleUrls: ['./sidebar-user-answer.component.scss']
})

export class SidebarUserAnswerComponent {

  @Input() projectId = '';

  @Input() questions: Array<Question> = [];

  // companies to show in the popover when hover over Company.
  @Input() excludedCompanies: Array<Company> = [];

  // make true to show the Edit toggle button.
  @Input() adminMode = false;

  @Input() set userAnswer(value: Answer) {
    this._reinitVariables();
    this._userAnswer = value;
    if (this._userAnswer && !this._userAnswer.company) {
      this._userAnswer.company = {};
    }
  }

  @Output() answerUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _userAnswer: Answer = <Answer>{};

  private _floor: any = Math.floor;

  private _editJob = false;

  private _editCompany = false;

  private _addNewEmail = false;

  private _editCountry = false;

  private _editMode = false;

  private _assignNewPro = false;

  private _newPro: NewPro = <NewPro>{};

  public newEmail = '';

  isReassigning = false;

  isImporting = false;

  isSaving = false;

  toBeSaved = false;

  constructor(private _translateService: TranslateService,
              private _answerService: AnswerService,
              private _professionalsService: ProfessionalsService,
              private _translateNotificationsService: TranslateNotificationsService) { }


  private _reinitVariables() {
    this._editMode = false;
    this._resetEdit();
  }

  private _resetEdit() {
    this._assignNewPro = false;
    this._editJob = false;
    this._editCompany = false;
    this._editCountry = false;
  }

  public OnChangeEdit(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this._editMode = true;
    } else {
      this._reinitVariables();
    }
  }

  public onChangeAssign(event: Event) {
    this._assignNewPro = (event.target as HTMLInputElement).checked;
  }

  public onClickEdit(activate: string) {

    switch (activate) {

      case 'COUNTRY':
        this._editCountry = !this._editCountry;
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


  public onSaveAnswer(event: Event) {
    event.preventDefault();
    if (!this.isSaving) {
      this.isSaving = true;
      this._resetEdit();

      if (this._userAnswer.professional && this._userAnswer.professional.email) {
        // Hack : les réponses anciennes n'ont pas de champ quizReference,
        // mais il faut forcément une valeur pour sauvegarder la réponse
        // TODO: remove this hack
        this._userAnswer.originalAnswerReference = this._userAnswer.originalAnswerReference || 'oldQuiz';
        this._userAnswer.quizReference = this._userAnswer.quizReference || 'oldQuiz';

        this._answerService.save(this._userAnswer._id, this._userAnswer).pipe(first()).subscribe(() => {
          this._translateNotificationsService.success('Success', 'The answer is updated.');
          this.isSaving = false;
          this.answerUpdated.emit(true);
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          this.isSaving = false;
        });
      } else {
        this._translateNotificationsService.error('Error',
          'The email of the professional associated with this answer is not exist.');
        this.isSaving = false;
      }

    }
  }

  public onProToAssign(pro: NewPro) {
    this._newPro = pro;
  }

  public onClickLanguage(language: string) {
    if (language !== this._userAnswer.professional.language) {
      this._professionalsService.changeProLanguage(this._userAnswer.professional._id, language).pipe(first())
        .subscribe(pro => {
          this._userAnswer.professional.language = pro.language;
          this._translateNotificationsService.success('Success', 'The professional language is updated.');
          }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          this.isSaving = false;
        });
    }
  }

  private _enableSave() {
    this.toBeSaved = true;
  }

  public updateProfileQuality(object: {value: number}) {
    this._userAnswer.profileQuality = object.value;
    this._enableSave();
  }

  public updateCountry(event: {value: Array<any>}) {
    this._userAnswer.country = event.value[0];
    this._enableSave();
  }


  public updateStatus(event: Event, status: any) {
    event.preventDefault();

    if (this._editMode) {
      this._userAnswer.status = status;
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.NOT_MODIFIED.USER_ANSWER');
    }

  }


  public addTag(tag: Tag): void {
    this._answerService.addTag(this._userAnswer._id, tag._id).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.ADDED');
      this._userAnswer.tags.push(tag);
      this.answerUpdated.emit(true);
      }, (err: any) => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
    });
  }


  public createTag(tag: Tag): void {
    this._answerService.createTag(this._userAnswer._id, tag).subscribe((newTag) => {
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.ADDED');
      this._userAnswer.tags.push(newTag);
      this.answerUpdated.emit(true);
      }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.TAGS.ALREADY_ADDED');
    });
  }


  public removeTag(tag: Tag): void {
    this._answerService.removeTag(this._userAnswer._id, tag._id).subscribe((a: any) => {
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.TAGS.REMOVED');
      this._userAnswer.tags = this._userAnswer.tags.filter(t => t._id !== tag._id);
      this.answerUpdated.emit(true);
      }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  public onImportAnswer(event: Event): void {
    event.preventDefault();
    if (!this.isImporting) {
      this.isImporting = true;
      this._answerService.importFromQuiz(this._userAnswer).pipe(first()).subscribe(() => {
        this._translateNotificationsService.success('Success' , 'The answer is imported.');
        this.isImporting = false;
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this.isImporting = false;
      });
    }
  }

  public onReassignAnswer(event: Event): void {
    event.preventDefault();
    if (!this.isReassigning) {
      this.isReassigning = true;
      // this._newPro.country = this._userAnswer.country && this._userAnswer.country.flag;
      // this._newPro.company = this._userAnswer.company && this._userAnswer.company.name;

      this._answerService.answerReassign(this._userAnswer.campaign, this._userAnswer.originalAnswerReference,
        this._userAnswer._id, this._newPro).pipe(first()).subscribe((_res: any) => {
        this._translateNotificationsService.success('Success' , 'The answer has been reassigned.');
        this.isReassigning = false;
        this._assignNewPro = false;
        this._newPro = <NewPro>{};
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this.isReassigning = false;
      });

    }
  }

  public addContactEmail() {
    this._professionalsService.addContactEmail(this._userAnswer.professional._id, this.newEmail).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS' , 'ERROR.SUCCESS');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.ERROR');
    });
  }

  public createdDate(date: Date) {
    return momentTimeZone(date).tz('Europe/Paris').format('MMM Do YYYY');
  }

  public createdTime(date: Date) {
    return momentTimeZone(date).tz('Europe/Paris').format('h:mm a');
  }

  get companyLength(): number {
    return this._userAnswer && (this._userAnswer.company && this._userAnswer.company.name && this._userAnswer.company.name.length ||
    this._userAnswer.professional && this._userAnswer.professional.company && this._userAnswer.professional.company.length) || 30;
  }

  get professionalName(): string {
    return UserFrontService.fullName(this._userAnswer.professional);
  }

  get meta(): any {
    return this._userAnswer.meta || {};
  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get userAnswer(): Answer {
    return this._userAnswer;
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

  get addNewEmail(): boolean {
    return this._addNewEmail;
  }

  set addNewEmail(value: boolean) {
    this._addNewEmail = value;
  }

  get assignNewPro(): boolean {
    return this._assignNewPro;
  }

  set assignNewPro(value: boolean) {
    this._assignNewPro = value;
  }

  get newPro(): NewPro {
    return this._newPro;
  }

  set newPro(value: NewPro) {
    this._newPro = value;
  }

  get mailType(): string {
    return this._userAnswer.mailType;
  }

  get autoTags(): Array<string> {
    return this._userAnswer.autoTags;
  }

}
