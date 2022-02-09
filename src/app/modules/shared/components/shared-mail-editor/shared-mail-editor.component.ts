import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {EmailSignature} from '../../../../models/email-signature';
import {EmailTemplate} from '../../../../models/email-template';
import {TranslateService} from '@ngx-translate/core';
import {Professional} from '../../../../models/professional';
import {FormatText} from '../../../../pipe/pipes/FormatText';
import {RouteFrontService} from '../../../../services/route/route-front.service';
import {EmailsObject} from '../../../../models/email';

const capitalize = new FormatText();

type editorTypes = 'FOLLOW-UP' | '';

interface Mapping {
  en: any;
  fr: any;
}
// TODO delete the follow-up code after multilang migration
@Component({
  selector: 'app-shared-mail-editor',
  templateUrl: './shared-mail-editor.component.html',
  styleUrls: ['./shared-mail-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class SharedMailEditorComponent implements OnInit {

  @Input() isEnablePreviewBtn = false; // to show / Hide the Preview button in the Default template.

  @Input() isEditableMode = false;

  @Input() canTestMails = false;

  @Input() templateType: editorTypes = '';

  @Input() ccEmail = '';

  @Input() innovationCardLanguages: string [] = [];

  @Input() set emailsObject(value: EmailsObject) {
    if (value) {
      this._emailsObject = value;
      this._email = this._emailsObject[this._language];
    }
  }

  @Input() set customFields(value: { [prop: string]: Array<{label: string, value: string}> }) {
    this._display = false;

    if (value) {
      this._customField = value[this._translateService.currentLang];

      // tslint:disable-next-line:forin
      for (const valueKey in value) {
        value[valueKey].forEach( (field: {label: string, value: string}) => {
          this._variableMapping[valueKey][field.value.replace(/[\|\*]/g, '')] = field.label;
        });
      }

      this._display = true;

    }

  }

  @Input() professionals: Array<Professional> = [];

  @Input() set inputLanguage(value: any) {
    if (value) {
      this.changeLanguage(value);
    }
  }

  @Input() signatures: Array<EmailSignature> = [];

  @Input() noLanguage = false;

  @Input() id = '';

  @Output() languageChange = new EventEmitter<string>();

  @Output() sendTestEmails = new EventEmitter();

  @Output() ccEmailChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() emailChange = new EventEmitter<any>();

  @Output() emailsObjectChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('textZone', { read: ElementRef, static: true }) child: any;

  private _display = false;

  private _customField: Array<{label: string, value: string}> = [];

  private _emailsObject: EmailsObject = {
    en: { language: 'en', subject: '', content: '' },
    fr: { language: 'fr', subject: '', content: '' },
    campaignId: '',
    step: ''
  };

  private _language = 'en';

  private _email: EmailTemplate = {
    language: this._language,
    subject: '',
    content: ''
  };

  private _languageHasBeenSet = false;

  private _variableMapping: Mapping = {
    en: {},
    fr: {}
  };

  private _professionalPreview = '';

  private _innovationId: string;

  constructor(private _translateService: TranslateService,
              private _routeFrontService: RouteFrontService) {
  }

  ngOnInit(): void {
    this._innovationId = this._routeFrontService.activeInnovationId();
  }

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
    this.sendTestEmails.emit();
  }

  public onSelectProfessional(professionalId: string) {
    if (professionalId) {
      const pro = this.professionals.find(_pro => _pro._id === professionalId);
      const language = pro.language;
      const html = '<span class="variable">';
      this._professionalPreview = `${this._emailsObject[language].subject}<p>${this._emailsObject[language].content}</p>`
        .replace(/\*\|FIRSTNAME\|\*/g, `${html}${capitalize.transform(pro.firstName, true)}</span>`)
        .replace(/\*\|LASTNAME\|\*/g,  `${html}${capitalize.transform(pro.lastName, true)}</span>`)
        .replace(/\*\|TITLE\|\*/g, `${html}${this._variableMapping[language].TITLE}</span>`)
        .replace(/\*\|CLIENT_NAME\|\*/g, `${html}${this._variableMapping[language].CLIENT_NAME}</span>`)
        .replace(/\*\|COMPANY_NAME\|\*/g, `${html}${this._variableMapping[language].COMPANY_NAME}</span>`);
    } else {
      this._professionalPreview = '';
    }
  }

  public updateChanges(ccEmail: string) {
    this.ccEmailChange.emit(ccEmail);
  }

  public onPreview() {
    this.isEditableMode = !this.isEditableMode;
  }

  public setLanguage(value: string) {
    this.changeLanguage(value);
    this.languageChange.emit(value);
  }

  public onUpdate(event: any, language?: string) {
    language = language || this._language;
    this._emailsObject[language].subject = event;
    this.emailChange.emit(this._emailsObject);
  }

  public updateContent(event: any, language?: string) {
    language = language || this._language;
    this._emailsObject[language].content = event.content;
    this.emailChange.emit(this._emailsObject);
  }

  get language(): string {
    return this._language;
  }

  get languageHasBeenSet(): Boolean {
    return this._languageHasBeenSet;
  }

  get email(): EmailTemplate {
    return this._email;
  }

  set email(value: EmailTemplate) {
    this._email = value;
  }

  get customField(): Array<{label: string, value: string}> {
    return this._customField;
  }

  get variableMapping(): Mapping {
    return this._variableMapping;
  }

  get emailsObject(): EmailsObject {
    return this._emailsObject;
  }

  get professionalPreview(): string {
    return this._professionalPreview;
  }

  get display(): boolean {
    return this._display;
  }

  get innovationId(): string {
    return this._innovationId;
  }

}
