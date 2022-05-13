import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from '../../../../models/question';
import { Answer } from '../../../../models/answer';
import { AnswerService } from '../../../../services/answer/answer.service';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import { Tag } from '../../../../models/tag';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import * as momentTimeZone from 'moment-timezone';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../services/error/error-front.service';
import { NewPro } from './reassign-answer/reassign-answer.component';
import { UserFrontService } from '../../../../services/user/user-front.service';
import { Professional } from '../../../../models/professional';
import { TranslateService } from '@ngx-translate/core';
import { MissionQuestion } from '../../../../models/mission';
import {InnovCard} from '../../../../models/innov-card';
import {UmiusCompanyInterface} from '@umius/umi-common-component/models/company';

@Component({
  selector: 'app-sidebar-user-answer',
  templateUrl: './sidebar-user-answer.component.html',
  styleUrls: ['./sidebar-user-answer.component.scss'],
})
export class SidebarUserAnswerComponent implements OnInit {

  @Input() set sidebarState(value: any) {
    this._reinitializeVariables();
  }

  @Input() projectId = ''; // id of the innovation

  @Input() set innovationCards(value: Array<InnovCard>) {
    this._getInnovationCardLanguages(value);
    this._initCurrentLang();
  }

  @Input() questions: Array<Question | MissionQuestion> = [];

  @Input() excludedCompanies: Array<UmiusCompanyInterface> = []; // companies to show in the popover when hover over Company.

  @Input() adminMode = false; // true to show the Edit toggle button and also shows the actions for the admin.

  @Input() set userAnswer(value: Answer) {
    this._reinitializeVariables();
    this._userAnswer = value || <Answer>{};
    if (!this._userAnswer.company) {
      this._userAnswer.company = {};
    }
  }

  @Output() answerUpdated: EventEmitter<boolean> = new EventEmitter<boolean>(); // sends updated answer.

  @Output() sendNewPro: EventEmitter<any> = new EventEmitter();

  @Output() userAnswerChange: EventEmitter<Answer> = new EventEmitter<Answer>();

  private _userAnswer: Answer = <Answer>{};

  private _floor: any = Math.floor;

  private _editJob = false;

  private _editCompany = false;

  private _editCountry = false;

  private _editMode = false;

  private _assignNewPro = false;

  private _newPro: NewPro = <NewPro>{};

  public newEmail = '';

  private _isReassigning = false;

  private _isImporting = false;

  private _isSaving = false;

  private _toBeSaved = false;

  private _editSecondEmail = false;

  private _testUp = false;

  private _answerStatus: Array<{ name: any; class: string }> = [
    {name: 'REJECTED', class: 'is-danger'},
    {name: 'SUBMITTED', class: 'is-progress'},
    {name: 'VALIDATED', class: 'is-success'},
  ];

  private _innovationCardLanguages: string[] = [];

  private _currentLang = this._translateService.currentLang;

  constructor(private _answerService: AnswerService,
              private _professionalsService: ProfessionalsService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  private _reinitializeVariables() {
    this._editMode = false;
    this._toBeSaved = false;
    this._resetEdit();
  }

  private _resetEdit() {
    this._assignNewPro = false;
    this._editJob = false;
    this._editCompany = false;
    this._editCountry = false;
    this._editSecondEmail = false;
  }

  public OnChangeEdit(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this._editMode = true;
    } else {
      this._reinitializeVariables();
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

      case 'JOB':
        this._editJob = !this._editJob;
        break;

      case 'COMPANY':
        this._editCompany = !this._editCompany;
        break;

      case 'SECOND_EMAIL':
        this._editSecondEmail = !this._editSecondEmail;
        break;
    }
  }

  public onSaveAnswer(event: Event) {
    event.preventDefault();
    if (!this._isSaving && this._toBeSaved) {
      this._isSaving = true;
      if (this._editSecondEmail) {
        this._addContactEmail();
      } else {
        this._updateAnswer();
      }
    }
  }

  /**
   * can also update the anonymous professional details or the answer of the same.
   *
   * @private
   */
  private _updateAnswer() {
    // Hack : les réponses anciennes n'ont pas de champ quizReference,
    // mais il faut forcément une valeur pour sauvegarder la réponse
    // TODO: remove this hack
    this._userAnswer.originalAnswerReference =
      this._userAnswer.originalAnswerReference || 'oldQuiz';
    this._userAnswer.quizReference =
      this._userAnswer.quizReference || 'oldQuiz';

    this._answerService
      .save(this._userAnswer._id, this._userAnswer)
      .pipe(first())
      .subscribe(
        () => {
          this._translateNotificationsService.success(
            'Success',
            'The answer is updated.'
          );
          this._resetEdit();
          this._resetSaveVariables();
          this.userAnswerChange.emit(this._userAnswer);
          this.answerUpdated.emit(true);
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          this._resetSaveVariables();
          console.error(err);
        }
      );
  }

  private _resetSaveVariables() {
    this._isSaving = false;
    this._toBeSaved = false;
  }

  public onProToAssign(pro: NewPro) {
    this._newPro = pro;
  }

  public onClickLanguage(language: string) {
    if (language !== this._userAnswer.professional.language) {
      this._professionalsService
        .changeProLanguage(this._userAnswer.professional._id, language)
        .pipe(first())
        .subscribe(
          (pro) => {
            this._userAnswer.professional.language = pro.language;
            this._translateNotificationsService.success(
              'Success',
              'The professional language is updated.'
            );
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorKey(err.error)
            );
            this._isSaving = false;
            console.error(err);
          }
        );
    }
  }

  public enableSave() {
    this._toBeSaved = true;
  }

  public updateProfileQuality(object: { value: number }) {
    this._userAnswer.profileQuality = object.value;
    this.enableSave();
  }

  public updateCountry(event: { value: Array<any> }) {
    this._userAnswer.country = event.value[0];
    this.enableSave();
  }

  public updateStatus(event: Event, status: 'REJECTED' | 'VALIDATED' | 'SUBMITTED') {
    event.preventDefault();
    this._userAnswer.status = status;
    this.enableSave();
  }

  public addTag(tag: Tag): void {
    console.log(tag);
    this._answerService
      .addTag(this._userAnswer._id, tag)
      .pipe(first())
      .subscribe(
        (tagResult) => {
          this._translateNotificationsService.success(
            'Success',
            'The tag is added to the answer.'
          );
          this._userAnswer.tags.push(tagResult);
          this.answerUpdated.emit(true);
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Error',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public createTag(tag: Tag): void {
    this._answerService
      .addTag(this._userAnswer._id, tag)
      .pipe(first())
      .subscribe(
        (newTag) => {
          this._translateNotificationsService.success(
            'Success',
            'The tag is created and added to the answer.'
          );
          this._userAnswer.tags.push(newTag);
          this.answerUpdated.emit(true);
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Error',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public removeTag(tag: Tag): void {
    this._answerService
      .removeTag(this._userAnswer._id, tag._id)
      .pipe(first())
      .subscribe(
        (a: any) => {
          this._translateNotificationsService.success(
            'Success',
            'The tag is removed from the answer.'
          );
          this._userAnswer.tags = this._userAnswer.tags.filter(
            (t) => t._id !== tag._id
          );
          this.answerUpdated.emit(true);
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          console.error(err);
        }
      );
  }

  public onImportAnswer(event: Event): void {
    event.preventDefault();
    if (!this._isImporting) {
      this._isImporting = true;
      this._answerService
        .importFromQuiz(this._userAnswer)
        .pipe(first())
        .subscribe(
          () => {
            this._translateNotificationsService.success(
              'Success',
              'The answer is imported.'
            );
            this._isImporting = false;
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorKey(err.error)
            );
            this._isImporting = false;
            console.error(err);
          }
        );
    }
  }

  public onReassignAnswer(event: Event): void {
    event.preventDefault();
    if (!this._isReassigning) {
      this._isReassigning = true;
      // this._newPro.country = this._userAnswer.country && this._userAnswer.country.flag;
      // this._newPro.company = this._userAnswer.company && this._userAnswer.company.name;

      this._answerService
        .answerReassign(
          this._userAnswer.campaign._id,
          this._userAnswer.originalAnswerReference,
          this._userAnswer._id,
          this._newPro
        )
        .pipe(first())
        .subscribe(
          (_res: any) => {
            this._translateNotificationsService.success(
              'Success',
              'The answer has been reassigned to the new professional.'
            );
            this._isReassigning = false;
            this._assignNewPro = false;
            this.sendNewPro.emit({newPro: this._newPro, _id: this._userAnswer._id});
            this._newPro = <NewPro>{};
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorKey(err.error)
            );
            this._isReassigning = false;
            console.error(err);
          }
        );
    }
  }

  private _addContactEmail() {
    this._professionalsService
      .addContactEmail(this._userAnswer.professional._id, this.newEmail)
      .pipe(first())
      .subscribe(
        () => {
          this._translateNotificationsService.success(
            'Success',
            'The second email is added to the professional.'
          );
          this._resetSaveVariables();
          this._editSecondEmail = false;
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorKey(err.error)
          );
          this._resetSaveVariables();
          this._editSecondEmail = false;
          console.error(err);
        }
      );
  }

  public createdDate(date: Date) {
    return momentTimeZone(date).tz('Europe/Paris').format('MMM Do YYYY');
  }

  public createdTime(date: Date) {
    return momentTimeZone(date).tz('Europe/Paris').format('h:mm a');
  }

  private _getInnovationCardLanguages(cards: Array<InnovCard> = []) {
    this._innovationCardLanguages = [];
    if (!!cards.length) {
      cards.map(innoCard => this._innovationCardLanguages.push(innoCard.lang));
    }
  }

  private _initCurrentLang() {
    this._currentLang = this._innovationCardLanguages.includes(this._currentLang) ? this._currentLang : this._innovationCardLanguages[0];
  }

  editThis() {
    this._testUp = true;
  }

  getValueTag(event: any) {
    if (event) {
      console.log(event);
    }
    this._testUp = false;
  }

  performAction(event: any) {
    switch (event.action) {
      case 'add':
        console.log(event);
        break;
      case 'delete':
        console.log(event);
        break;
    }
    this._testUp = false;
  }

  get companyLength(): number {
    return (
      (this._userAnswer.company &&
        this._userAnswer.company.name &&
        this._userAnswer.company.name.length) ||
      (this.professional.company && this.professional.company.length) ||
      30
    );
  }

  get professional(): Professional {
    return this._userAnswer.professional
      ? this._userAnswer.professional
      : <Professional>{};
  }

  get professionalName(): string {
    return UserFrontService.fullName(this.professional);
  }

  get meta(): any {
    return this._userAnswer.meta || {};
  }

  /**
   * Get the list of warnings associated to the answer
   */
  get answerWarnings(): Array<{message:string}> {
    return this._userAnswer.warnings;
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

  get assignNewPro(): boolean {
    return this._assignNewPro;
  }

  get newPro(): NewPro {
    return this._newPro;
  }

  get mailType(): string {
    return this._userAnswer.mailType;
  }

  get autoTags(): Array<string> {
    return this._userAnswer.autoTags && this._userAnswer.autoTags.length
      ? this._userAnswer.autoTags
      : [];
  }

  get isReassigning(): boolean {
    return this._isReassigning;
  }

  get isImporting(): boolean {
    return this._isImporting;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  get editSecondEmail(): boolean {
    return this._editSecondEmail;
  }

  get answerStatus(): Array<{ name: any; class: string }> {
    return this._answerStatus;
  }

  get currentLang(): string {
    return this._currentLang;
  }


  get testUp(): boolean {
    return this._testUp;
  }

}
