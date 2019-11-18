import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';
import { EmailTemplate } from '../../../../models/email-template';
import { TranslateService } from '@ngx-translate/core';
import { Professional } from "../../../../models/professional";

type editorTypes = 'FOLLOW-UP' | '';

interface EmailsObject {
  fr: EmailTemplate;
  en: EmailTemplate;
}

interface Mapping {
  en: any;
  fr: any;
}

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

  @Input() set emailsObject(value: EmailsObject) {
    if (value) {
      this._emailsObject = value;
      this._email = this._emailsObject[this._language];
    }
  }

  @Input() set customFields(value: { [prop: string]: Array<{label: string, value: string}> }) {
    if (value) {
      this._customField = value[this._translateService.currentLang];

      for (let valueKey in value) {
        value[valueKey].forEach( (field: {label: string, value: string}) => {
          this._variableMapping[valueKey][field.value.replace(/[\|\*]/g, '')] = field.label;
        });
      }

    }
  }

  @Input() set ccEmail(value: string) {
    if (value) {
      this._ccEmail = value;
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

  @Input() signatures: Array<EmailSignature> = [];

  @Input() noLanguage: Boolean;

  @Input() id: string = '';

  @Output() languageChange = new EventEmitter<string>();

  @Output() ccEmailChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() emailChange = new EventEmitter<any>();

  @Output() emailsObjectChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('textZone') child: any;

  private _professionals: Array<Professional> = [];

  private _templateType: editorTypes = '';

  private _customField: Array<{label: string, value: string}> = [];

  private _emailsObject: EmailsObject = {
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

  private _isEditableMode: boolean = true;

  private _ccEmail: string = '';

  private _variableMapping: Mapping = {
    en: {},
    fr: {}
  };

  private _professionalPreview: string = '';

  constructor(private _translateService: TranslateService) { }

  public changeLanguage(value: string) {
    this._language = value;
    this._languageHasBeenSet = true;

    if (this._emailsObject) {
      this._email = this._emailsObject[this._language];
    }

  }

  public insertTextAtCursor(text: string) {
    this.child.insertTextAtCursor(text);
  }

  public onClickTestEmails(event: Event) {
    event.preventDefault();
  }

  public onSelectProfessional(professionalId: string) {
    if (professionalId) {
      const pro = this._professionals.find(pro => pro._id === professionalId);
      const language = pro.language;
      this._professionalPreview = `<h5>${this._emailsObject[language].subject}</h5><p>${this._emailsObject[language].content}</p>`
        .replace(/\*\|FIRSTNAME\|\*/g, pro.firstName)
        .replace(/\*\|LASTNAME\|\*/g, pro.lastName)
        .replace(/\*\|TITLE\|\*/g, this._variableMapping[language].TITLE)
        .replace(/\*\|CLIENT_NAME\|\*/g, this._variableMapping[language].CLIENT_NAME)
        .replace(/\*\|COMPANY_NAME\|\*/g, this._variableMapping[language].COMPANY_NAME);
    } else {
      this._professionalPreview = '';
    }
  }

  public updateChanges(event: Event) {
    this.emailsObjectChange.emit(this._emailsObject);
    this.ccEmailChange.emit(this._ccEmail);
  }

  public onPreview() {
    this._isEditableMode = !this._isEditableMode;
  }

  setLanguage(value: string) {
    this.changeLanguage(value);
    this.languageChange.emit(value);
  }

  onUpdate(event: any) {
    this._emailsObject[this._language].subject = event;
    this.emailChange.emit(this._emailsObject);
  }

  updateContent(event: any) {
    this._emailsObject[this._language].content = event.content;
    this.emailChange.emit(this._emailsObject);
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

  get isEditableMode(): boolean {
    return this._isEditableMode;
  }

  get customField(): Array<{label: string, value: string}> {
    return this._customField;
  }

  get variableMapping(): Mapping {
    return this._variableMapping;
  }

  get templateType(): editorTypes {
    return this._templateType;
  }

  get professionals(): Array<Professional> {
    return this._professionals;
  }

  get emailsObject(): EmailsObject {
    return this._emailsObject;
  }

  get professionalPreview(): string {
    return this._professionalPreview;
  }

}
