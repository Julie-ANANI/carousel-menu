import {Component, EventEmitter, Input, Output} from '@angular/core';
import { EmailTemplate } from '../../../../models/email-template';


@Component({
  selector: 'app-sidebar-workflow',
  templateUrl: './sidebar-workflow.component.html',
  styleUrls: ['./sidebar-workflow.component.scss']
})
export class SidebarWorkflowComponent {

  @Input() set emailsObject(value: any) {
    this._emailsObject = value;
    if (value) {
      this._email = this._emailsObject[this.language];
    }
  }
  @Input() set inputLanguage(value: any) {
    this.changeLanguage(value);
  }
  @Input() inCampaign: boolean;
  @Output() emailChange = new EventEmitter<any>();

  private _emailsObject: any = {};
  private _language: string = 'en';
  private _email: EmailTemplate;
  public editionMode: boolean = true;

  constructor() {
  }

  public changeLanguage(value: string) {
    this._language = value;
    if (this._emailsObject) {
      this.email = this._emailsObject[this.language];
    }
  }

  public save() {
    this._emailsObject[this._language].modified = true;
    this.emailChange.emit(this._emailsObject);
  }

  public updateContent(event: any) {
    this._emailsObject[this._language].content = event.content;
  }

  get language(): string { return this._language; }
  set language(value: string) { this._language = value; }
  get email(): EmailTemplate { return this._email; }
  set email(value: EmailTemplate) { this._email = value; }
}
