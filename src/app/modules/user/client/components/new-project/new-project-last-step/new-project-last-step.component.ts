import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Consent} from '../../../../../../models/innovation';
import {CommonService} from '../../../../../../services/common/common.service';
import {IMyDateModel} from 'angular-mydatepicker';

@Component({
  selector: 'app-new-project-last-step',
  templateUrl: './new-project-last-step.component.html',
  styleUrls: ['./new-project-last-step.component.scss']
})
export class NewProjectLastStepComponent {

  @Input() set reportingLang(value: string) {
   this._reportingLang = value;
  }

  @Output() reportingLangChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() milestoneDateCommentChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() projectNameChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() collaboratorsConsent: EventEmitter<Consent> = new EventEmitter<Consent>();

  @Output() collaboratorsChange: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  @Output() restitutionDateChange: EventEmitter<Date> = new EventEmitter<Date>();

  private _projectLangs: Array<string> = ['en', 'fr'];

  private _reportingLang = '';

  private _milestoneDateComment = '';

  private _title = '';

  private _consent = false;

  private _collaborators: Array<string> = [];

  private _restitutionDate = this._commonService.getFutureMonth();

  isRestitutionDateSelected = false;

  constructor(private _translateService: TranslateService,
              private _commonService: CommonService) { }

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
   * @param value
   */
  public onChangeMilestoneComment(value: string) {
    this._milestoneDateComment = value;
    this.milestoneDateCommentChange.emit(this._milestoneDateComment);
  }

  /**
   * when the user enter the title of the project
   * @param value
   */
  public onChangeProject(value: string) {
    this._title = value;
    this.projectNameChange.emit(this._title);
  }

  /**
   * when user toggles the checkbox of the collaborators consent.
   * @param value
   */
  public consentChange(value: boolean) {
    this._consent = value;
    this.collaboratorsConsent.emit({
      value: this._consent,
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
      this.isRestitutionDateSelected = true;
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

  get projectLangs(): Array<string> {
    return this._projectLangs;
  }

  get consent(): boolean {
    return this._consent;
  }

  get title(): string {
    return this._title;
  }

  get collaborators(): Array<string> {
    return this._collaborators;
  }

  get milestoneDateComment(): string {
    return this._milestoneDateComment;
  }

  get restitutionDate(): string {
    return this._restitutionDate;
  }

}
