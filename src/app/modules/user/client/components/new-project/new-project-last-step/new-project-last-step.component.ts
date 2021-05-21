import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Consent} from '../../../../../../models/innovation';

@Component({
  selector: 'app-new-project-last-step',
  templateUrl: './new-project-last-step.component.html',
  styleUrls: ['./new-project-last-step.component.scss']
})
export class NewProjectLastStepComponent {

  @Input() set projectLang(value: string) {
   this._projectLang = value;
  }

  @Output() projectLangChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() milestoneDateCommentChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() projectNameChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() collaboratorsConsent: EventEmitter<Consent> = new EventEmitter<Consent>();

  @Output() collaboratorsChange: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  private _projectLangs: Array<string> = ['en', 'fr'];

  private _projectLang = this.currentLang;

  private _milestoneDateComment = '';

  private _title = '';

  private _consent = false;

  private _collaborators: Array<string> = [];

  constructor(private _translateService: TranslateService) { }

  public onChangeProjectLang(event: Event, value: string) {
    event.preventDefault();
    if (this._projectLang !== value) {
      this.projectLangChange.emit(value);
    }
  }

  public onChangeMilestoneComment(value: string) {
    this._milestoneDateComment = value;
    this.milestoneDateCommentChange.emit(this._milestoneDateComment);
  }

  public onChangeProject(value: string) {
    this._title = value;
    this.projectNameChange.emit(this._title);
  }

  public consentChange(value: boolean) {
    this._consent = value;
    this.collaboratorsConsent.emit({
      value: this._consent,
      date: new Date()
    });
  }

  public addEmail(value: string) {
    const find = this._collaborators.find((email) => email === value);
    if (!find) {
      this._collaborators.push(value);
      this._emitCollaborators();
    }
  }

  public removeEmail(value: string) {
    this._collaborators = this._collaborators.filter((email) => email !== value);
    this._emitCollaborators();
  }

  private _emitCollaborators() {
    this.collaboratorsChange.emit(this._collaborators);
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get projectLang(): string {
    return this._projectLang;
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

}
