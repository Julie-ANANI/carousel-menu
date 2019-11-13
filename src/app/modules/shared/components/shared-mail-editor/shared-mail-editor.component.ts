import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';
import { EmailTemplate } from '../../../../models/email-template';

@Component({
  selector: 'app-shared-mail-editor',
  templateUrl: './shared-mail-editor.component.html',
  styleUrls: ['./shared-mail-editor.component.scss']
})

export class SharedMailEditorComponent implements OnInit {

  @Input() set emailsObject(value: any) {
    this._emailsObject = value;
    if (value) {
      this._email = this._emailsObject[this.language];
    }
  }

  @Input() set signatures(value: Array<EmailSignature> ){
    this._signatures = value;
  }

  @Input() set inputLanguage(value: any) {
    this.changeLanguage(value);
  }

  @Input() set customFields(value: Array<{label: string, value: string}>) {
    this._customFields = value;
    this._variableMapping = {};
      this._customFields.forEach(field => {
      this._variableMapping[field.value.replace(/[\|\*]/g, '')] = field.label;
    })
  }

  @Input() set ccEmail(value: string) {
    this._ccEmail = value;
    this.ccEmailField = true;
  }

  @Input() noLanguage: Boolean;

  @Input() set id(value: string) {
    this._id = value;
  }

  @Output() languageChange = new EventEmitter<string>();

  @Output() ccEmailChange = new EventEmitter<string>();

  @Output() emailChange = new EventEmitter<any>();

  @ViewChild('textZone') child: any;

  private _customFields: Array<{label: string, value: string}> = [];

  private _signatures: Array<EmailSignature> = [];

  private _emailsObject: any = {};

  private _language = 'en';

  private _id: string;

  private _email: EmailTemplate;

  private _languageHasBeenSet: Boolean = false;

  private _editionMode = true;

  private _ccEmail = "";

  public ccEmailField = false;

  private _variableMapping: any = {};

  ngOnInit() {
    this._signatures = [];
    this._editionMode = true;
    if (!this._email) {
      this._email = {language: this._language, subject: '', content: ''};
    }
    this._emailsObject = {
      en: {language: 'en', subject: '', content: ''},
      fr: {language: 'fr', subject: '', content: ''}
    };
  }

  public insertTextAtCursor(text: string) {
    this.child.insertTextAtCursor(text)
  }


  setLanguage(value: string) {
    this.changeLanguage(value);
    this.languageChange.emit(value);
  }


  changeLanguage(value: string) {
    if (value) this._languageHasBeenSet = true;
    this._language = value;
    if (this._emailsObject) {
      this._email = this._emailsObject[this._language];
    }
  }

  onCcEmailUpdate(event: any) {
    this._ccEmail = event;
    this.ccEmailChange.emit(this._ccEmail);
  }


  onUpdate(event: any) {
    this._emailsObject[this._language].subject = event;
    this.emailChange.emit(this._emailsObject);
  }


  updateContent(event: any) {
    this._emailsObject[this._language].content = event.content;
    this.emailChange.emit(this._emailsObject);
  }


  onPreview() {
    this._editionMode = !this._editionMode;
  }

  get signatures(): Array<EmailSignature> {
    return this._signatures;
  }

  get language(): string {
    return this._language;
  }

  get languageHasBeenSet(): Boolean {
    return this._languageHasBeenSet;
  }

  get ccEmail(): string {
    return this._ccEmail;
  }

  get email(): EmailTemplate {
    return this._email;
  }

  set email(value: EmailTemplate) {
    this._email = value;
  }

  get editionMode(): boolean {
    return this._editionMode;
  }

  get id(): string {
    return this._id;
  }

  get customFields(): Array<{label: string, value: string}> {
    return this._customFields;
  }

  get variableMapping(): any {
    return this._variableMapping;
  }
}
