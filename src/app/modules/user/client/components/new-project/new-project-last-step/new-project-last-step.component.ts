import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IMyDateModel} from 'angular-mydatepicker';
import {Consent} from '../../../../../../models/consent';
import {DOCUMENT} from '@angular/common';
import {PageScrollService} from 'ngx-page-scroll-core';
import * as moment from 'moment';
import {UmiusTextInputPlaceholder} from '@umius/umi-common-component';

@Component({
  selector: 'app-new-project-last-step',
  templateUrl: './new-project-last-step.component.html',
  styleUrls: ['./new-project-last-step.component.scss']
})
export class NewProjectLastStepComponent {
  get textInputPlaceholder(): UmiusTextInputPlaceholder {
    return this._textInputPlaceholder;
  }

  /**
   * @param value
   */
  @Input() set reportingLang(value: string) {
   this._reportingLang = value;
  }

  /**
   * @param value
   */
  @Input() set projectName(value: string) {
    this._projectName = value;
  }

  /**
   * @param value
   */
  @Input() set milestoneDateComment(value: string) {
    this._milestoneDateComment = value;
  }

  /**
   *
   * @param value
   */
  @Input() set collaboratorsConsent(value: Consent) {
    this._collaboratorsConsent = value;
  }

  /**
   *
   * @param value
   */
  @Input() set collaborators(value: Array<string>) {
    this._collaborators = value;
  }

  /**
   *
   * @param value
   */
  @Input() set restitutionDate(value: Date) {
    this._restitutionDate = value;
  }

  @Output() reportingLangChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() milestoneDateCommentChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() projectNameChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() collaboratorsConsentChange: EventEmitter<Consent> = new EventEmitter<Consent>();

  @Output() collaboratorsChange: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  @Output() restitutionDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  private _projectLangs: Array<string> = ['en', 'fr'];

  private _reportingLang = '';

  private _projectName = '';

  private _milestoneDateComment = '';

  private _collaboratorsConsent: Consent = <Consent>{};

  private _collaborators: Array<string> = [];

  private _restitutionDate: Date = new Date();

  private _errors = false;

  /**
   * upto this date all the previous date are disabled for the selection.
   * @private
   */
  private _disabledDate = moment().add(-1, 'days').format('YYYY-MM-DD');

  private _isRestitutionDateSelected = false;

  private _textInputPlaceholder: UmiusTextInputPlaceholder = {
    input: 'jhon@catco.com'
  }

  constructor(@Inject(DOCUMENT) private _document: Document,
              private _translateService: TranslateService,
              private _pageScrollService: PageScrollService) { }

  /**
   * when user select the lang of the project.
   * @param event
   * @param value
   */
  public onChangeProjectLang(event: Event, value: string) {
    event.preventDefault();
    if (this._reportingLang !== value) {
      this.reportingLangChange.emit(value);
    }
  }

  /**
   * when the user writes the comment in the textarea of the restitution date.
   */
  public onChangeMilestoneComment() {
    this.milestoneDateCommentChange.emit(this._milestoneDateComment);
  }

  /**
   * when the user enter the title of the project
   */
  public onChangeProject() {
    if(!!this._projectName && this._projectName.trim().length > 0) {
      this._errors = false;
      this.projectNameChange.emit(this._projectName.trim());
    } else {
      this._errors = true;
    }
  }

  /**
   * when user toggles the checkbox of the collaborators consent.
   * @param value
   */
  public consentChange(value: boolean) {
    this.collaboratorsConsentChange.emit({
      value: value,
      date: new Date()
    });
  }

  /**
   * email to add as collaborator.
   * @param value
   */
  public addEmail(value: string) {
    const find = this._collaborators.find((email) => email === value);
    if (!find) {
      this._collaborators.push(value);
      this._emitCollaborators();
    }
  }

  /**
   * click on the cross btn of the collaborators list to remove it.
   * @param value
   */
  public removeEmail(value: string) {
    this._collaborators = this._collaborators.filter((email) => email !== value);
    this._emitCollaborators();
  }

  /**
   * when user select the date from the date picker.
   * we emit the selected date as restitution date
   * @param event
   */
  public onChangeRestitutionDate(event: IMyDateModel) {
    if (event && event.singleDate && event.singleDate.jsDate) {
      this.restitutionDateChange.emit(event.singleDate.jsDate);
      this._isRestitutionDateSelected = true;
      this._pageScrollService.scroll({
        document: this._document,
        scrollTarget: '#arrow-title',
      });
    }
  }

  private _emitCollaborators() {
    this.collaboratorsChange.emit(this._collaborators);
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get reportingLang(): string {
    return this._reportingLang;
  }

  get projectName(): string {
    return this._projectName;
  }

  get restitutionDate(): Date {
    return this._restitutionDate;
  }

  get projectLangs(): Array<string> {
    return this._projectLangs;
  }

  get collaboratorsConsent(): Consent {
    return this._collaboratorsConsent;
  }

  get collaborators(): Array<string> {
    return this._collaborators;
  }

  get milestoneDateComment(): string {
    return this._milestoneDateComment;
  }

  get disabledDate(): string {
    return this._disabledDate;
  }

  get isRestitutionDateSelected(): boolean {
    return this._isRestitutionDateSelected;
  }

  get errors():boolean {
    return this._errors;
  }

}
