import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Professional} from '../../../../../../../models/professional';
import {TranslateService} from '@ngx-translate/core';
import {InnovationFollowUpEmailsTemplate} from '../../../../../../../models/innovation';
import {LangEntryService} from '../../../../../../../services/lang-entry/lang-entry.service';
import {TitleCasePipe} from '@angular/common';

interface Mapping {
  en: any;
  fr: any;
}

@Component({
  selector: 'app-shared-follow-up-admin-editor',
  templateUrl: './shared-follow-up-admin-editor.component.html',
  styleUrls: ['./shared-follow-up-admin-editor.component.scss']
})
export class SharedFollowUpAdminEditorComponent implements OnInit {

  get customField(): Array<{label: string, value: string}> {
    return this._customField;
  }

  get variableMapping(): Mapping {
    return this._variableMapping;
  }

  get professionalPreview(): string {
    return this._professionalPreview;
  }

  @Input() isEditableMode = true;

  @Input() canTestMails = false;

  @Input() ccEmail = '';

  @Input() professionals: Array<Professional> = [];

  @Input() emailTemplate: InnovationFollowUpEmailsTemplate = <InnovationFollowUpEmailsTemplate>{}

  @Input() set customFields(value: { [prop: string]: Array<{label: string, value: string}> }) {
    if (value) {
      this._customField = value[this._translateService.currentLang];

      // tslint:disable-next-line:forin
      for (const valueKey in value) {
        value[valueKey].forEach( (field: {label: string, value: string}) => {
          this._variableMapping[valueKey][field.value.replace(/[\|\*]/g, '')] = field.label;
        });
      }
    }
  }

  @Output() ccEmailChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() sendTestEmails: EventEmitter<void> = new EventEmitter<void>();

  @Output() emailTemplateChange: EventEmitter<InnovationFollowUpEmailsTemplate> = new EventEmitter<InnovationFollowUpEmailsTemplate>();

  @ViewChild('textZone', { read: ElementRef }) child: any;

  private _customField: Array<{label: string, value: string}> = [];

  private _variableMapping: Mapping = {
    en: {},
    fr: {}
  };

  private _professionalPreview = '';

  constructor(private _translateService: TranslateService,
              private _titleCasePipe: TitleCasePipe) { }

  ngOnInit(): void {
  }

  public insertTextAtCursor(text: string) {
    this.child.insertTextAtCursor(text);
  }

  public onClickTestEmails(event: Event) {
    event.preventDefault();
    this.sendTestEmails.emit();
  }

  /**
   * TODO delete the commented part after multilang migration
   * @param professionalId
   */
  public onSelectProfessional(professionalId: string) {
    if (professionalId) {
      const pro = this.professionals.find(_pro => _pro._id === professionalId);
      const language = pro.language;
      const html = '<span class="label is-mail width-120 is-sm m-h text-xs text-background m-no-right">';
      const entryIndex = LangEntryService.entryIndex(this.emailTemplate.entry, 'lang', language);

      if (entryIndex !== -1) {
        this._professionalPreview = `${this.emailTemplate.entry[entryIndex].subject}<p>${this.emailTemplate.entry[entryIndex].content}</p>`
          .replace(/\*\|FIRSTNAME\|\*/g, `${html}${this._titleCasePipe.transform(pro.firstName)}</span>`)
          .replace(/\*\|LASTNAME\|\*/g,  `${html}${this._titleCasePipe.transform(pro.lastName)}</span>`)
          .replace(/\*\|TITLE\|\*/g, `${html}${this._variableMapping[language].TITLE}</span>`)
          .replace(/\*\|CLIENT_NAME\|\*/g, `${html}${this._variableMapping[language].CLIENT_NAME}</span>`)
          .replace(/\*\|COMPANY_NAME\|\*/g, `${html}${this._variableMapping[language].COMPANY_NAME}</span>`);
      }
      /*this._professionalPreview = `${this._emailsObject[language].subject}<p>${this._emailsObject[language].content}</p>`
        .replace(/\*\|FIRSTNAME\|\*!/g, `${html}${capitalize.transform(pro.firstName, true)}</span>`)
        .replace(/\*\|LASTNAME\|\*!/g,  `${html}${capitalize.transform(pro.lastName, true)}</span>`)
        .replace(/\*\|TITLE\|\*!/g, `${html}${this._variableMapping[language].TITLE}</span>`)
        .replace(/\*\|CLIENT_NAME\|\*!/g, `${html}${this._variableMapping[language].CLIENT_NAME}</span>`)
        .replace(/\*\|COMPANY_NAME\|\*!/g, `${html}${this._variableMapping[language].COMPANY_NAME}</span>`);*/
    } else {
      this._professionalPreview = '';
    }
  }

  /**
   * TODO delete the commented part after multilang migration
   * @param attr
   * @param value
   * @param language
   */
  public onUpdate(attr: 'subject' | 'content', value: string, language: string) {
    // language = language || this._language;
    // this._emailsObject[language].subject = event;
    // this.emailChange.emit(this._emailsObject);
    const entryIndex = LangEntryService.entryIndex(this.emailTemplate.entry, 'lang', language);
    this.emailTemplate.entry[entryIndex][attr] = value;
    this.emailTemplateChange.emit(this.emailTemplate);
  }

  public updateChanges(ccEmail: string) {
    this.ccEmailChange.emit(ccEmail);
  }

}
