import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss']
})

export class WorkflowFormComponent {

  @Input() set emailsObject(value: any) {
    this._emailsObject = value;
  }

  @Input() set signatures(value: Array<EmailSignature>){
    this._signatures = value;
  }

  @Input() set inputLanguage(value: any) {
    this._language = value;
  }

  @Input() set id(value: string) {
    this._id = value || this._language;
  }

  @Output() emailChange = new EventEmitter<any>();

  private _signatures: Array<EmailSignature> = [];

  private _emailsObject: any = {};

  private _language = 'en';

  private _id = null;

  constructor() { }

  onClickSave() {
    this._emailsObject[this._language].modified = true;
    this.emailChange.emit(this._emailsObject);
  }


  onChangeEmail(value: any) {
    this._emailsObject = value;
  }

  get signatures(): Array<EmailSignature> {
    return this._signatures;
  }

  get emailsObject() {
    return this._emailsObject;
  }

  get language(): string {
    return this._language;
  }

  set language(value: string) {
    this._language = value;
  }

  get id(): string {
    return this._id;
  }

}
