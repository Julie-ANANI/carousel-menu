import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';
import { EmailTemplate } from '../../../../models/email-template';
import { TranslateService } from '@ngx-translate/core';
import { Professional } from "../../../../models/professional";

type editorTypes = 'FOLLOW-UP' | '';

@Component({
  selector: 'shared-mail-editor',
  templateUrl: './shared-mail-editor.component.html',
  styleUrls: ['./shared-mail-editor.component.scss']
})

export class SharedMailEditorComponent {

  @Input() set templateType(value: editorTypes) {
    if (value) {
      this._templateType = value;
    }
  }

  @Input() set emailsObject(value: any) {
    if (value) {
      console.log(value);
      this._emailsObject = value;
      this._email = this._emailsObject[this._language];
    }
  }

  @Input() set customFields(value: { [prop: string]: Array<{label: string, value: string}> }) {
    if (value) {
      this._customField = value[this._translateService.currentLang];

      this._customField.forEach( (field) => {
        this._variableMapping[field.value.replace(/[\|\*]/g, '')] = field.label;
      });
    }
  }

  @Input() set ccEmail(value: string) {
    if (value) {
      this._ccEmail = value;
      this._ccEmailField = true;
    }
  }

  @Input() set professionals(value: Array<Professional>) {
    if (value) {
      this._professionals = value;
    }
  }

  @Input() set inputLanguage(value: any) {
    if (value) {
      this.changeLanguage(value);
    }
  }

  @Input() isEditable: boolean = true;

  @Input() signatures: Array<EmailSignature> = [];

  @Input() noLanguage: Boolean;

  @Input() id: string = '';

  @Output() languageChange = new EventEmitter<string>();

  @Output() ccEmailChange = new EventEmitter<string>();

  @Output() emailChange = new EventEmitter<any>();

  @Output() emailsObjectChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('textZone') child: any;

  private _professionals: Array<Professional> = [];

  private _templateType: editorTypes = '';

  private _customField: Array<{label: string, value: string}> = [];

  private _emailsObject: any = {
    en: { language: 'en', subject: '', content: '' },
    fr: { language: 'fr', subject: '', content: '' }
  };

  private _language: string = 'en';

  private _email: EmailTemplate = {
    language: this._language,
    subject: '',
    content: ''
  };

  private _languageHasBeenSet: boolean = false;

  private _editionMode: boolean = true;

  private _ccEmail: string = '';

  private _ccEmailField: boolean = false;

  private _variableMapping: any = {};

  constructor(private _translateService: TranslateService) { }

  public changeLanguage(value: string) {
    this._language = value;
    this._languageHasBeenSet = true;

    if (this._emailsObject) {
      this._email = this._emailsObject[this._language];
    }

  }

  public insertTextAtCursor(text: string) {
    this.child.insertTextAtCursor(text)
  }

  public onClickTestEmails(event: Event) {
    event.preventDefault();
  }

  public onSelectProfessional(professional: Professional) {
    console.log(professional);
    /* FIXME
    this._variableMapping[professional.language].FIRSTNAME = professional.firstName;
    this._variableMapping[professional.language].LASTNAME = professional.lastName;
    */
  }

  setLanguage(value: string) {
    this.changeLanguage(value);
    this.languageChange.emit(value);
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

  get customField(): Array<{label: string, value: string}> {
    return this._customField;
  }

  get variableMapping(): any {
    return this._variableMapping;
  }

  get ccEmailField(): boolean {
    return this._ccEmailField;
  }

  get templateType(): editorTypes {
    return this._templateType;
  }

  get professionals(): Array<Professional> {
    return this._professionals;
  }

}
