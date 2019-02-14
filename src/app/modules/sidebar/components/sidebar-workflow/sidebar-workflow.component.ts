import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';

@Component({
  selector: 'app-sidebar-workflow',
  templateUrl: './sidebar-workflow.component.html',
  styleUrls: ['./sidebar-workflow.component.scss']
})

export class SidebarWorkflowComponent {

  @Input() set emailsObject(value: any) {
    this._emailsObject = value;
  }

  @Input() set signatures(value: Array<EmailSignature>){
    this._signatures = value;
  }

  @Input() set inputLanguage(value: any) {
    this._language = value;
  }

  @Output() emailChange = new EventEmitter<any>();

  private _signatures: Array<EmailSignature> = [];

  private _emailsObject: any = {};

  private _language = 'en';

  private _activeSaveButton: boolean;

  constructor() { }


  onClickSave() {
    this._emailsObject[this._language].modified = true;
    this.emailChange.emit(this._emailsObject);
    this._activeSaveButton = false;
  }


  onChangeEmail(value: any) {
    this._emailsObject = value;
    this._activeSaveButton = true;
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

  get activeSaveButton(): boolean {
    return this._activeSaveButton;
  }

}
