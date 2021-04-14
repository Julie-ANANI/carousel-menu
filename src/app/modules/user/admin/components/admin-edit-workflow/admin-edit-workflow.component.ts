import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmailScenario } from '../../../../../models/email-scenario';
import { EmailTemplate } from '../../../../../models/email-template';
import { SidebarInterface } from '../../../../sidebars/interfaces/sidebar-interface';
import { EmailSignature } from '../../../../../models/email-signature';
import { Config } from '../../../../../models/config';
import { Column } from '../../../../table/models/column';
import { Table } from '../../../../table/models/table';

@Component({
  selector: 'app-admin-edit-workflow',
  templateUrl: 'admin-edit-workflow.component.html',
  styleUrls: ['admin-edit-workflow.component.scss'],
})
export class AdminEditWorkflowComponent {
  @Input() isEditable = false;

  @Input() isDeletable = false;

  @Input() set scenario(value: EmailScenario) {
    this._campaignScenario = value;
    this._inCampaign =
      this._campaignScenario.emails[0] &&
      this._campaignScenario.emails[0].modified != undefined;
    this._setModified();
    this._initTable();
  }

  @Input() defaultScenario = '';

  @Input() campaignId = '';

  @Input() set signatures(value: Array<EmailSignature>) {
    this._signatures = value;
    this._initTable();
  }

  @Output() defaultScenarioChange = new EventEmitter<string>();

  @Output() scenarioChange = new EventEmitter<EmailScenario>();

  @Output() deletedScenario = new EventEmitter<EmailScenario>();

  private _modalDelete = false;

  private _isModifiedEn = false;

  private _isModifiedFr = false;

  private _inCampaign = false;

  private _language = 'en';

  private _signatures: Array<EmailSignature> = [];

  private _emails: Array<any> = [];

  private _total = 0;

  private _emailToEdit: any;

  private _sidebar: SidebarInterface = <SidebarInterface>{};

  private _tableInfos: Table = <Table>{};

  private _campaignScenario: EmailScenario = <EmailScenario>{};

  private _localConfig: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}',
  };

  constructor() {}

  private _initTable() {
    const steps: any = {
      FIRST: { step: 'FIRST', num: '01 - ' },
      SECOND: { step: 'SECOND', num: '02 - ' },
      THIRD: { step: 'THIRD', num: '03 - ' },
      THANKS: { step: 'THANKS', num: '04 - ' },
    };

    this._campaignScenario.emails.forEach((email: EmailTemplate) => {
      steps[email.step][email.language] = email;
      email.defaultSignatureName = email.signature
        ? email.signature.name
        : 'Karine Caulfield'; //TODO why a workflow wouldn't have a signature??
      email.status = email.modified ? email.modified.toString() : 'false';
    });

    this._emails = [steps.FIRST, steps.SECOND, steps.THIRD, steps.THANKS];

    this._total = this._campaignScenario.emails.length;

    const columns: Array<Column> = [
      {
        _attrs: ['num', `${this._language}.subject`],
        _name: 'Emails',
        _type: 'TEXT',
        _choices: null,
      },
      {
        _attrs: [`${this._language}.defaultSignatureName`],
        _name: 'Signatures',
        _type: 'TEXT',
        _choices: null,
      },
    ];

    if (this._inCampaign) {
      columns.push({
        _attrs: [`${this._language}.status`],
        _name: 'Status',
        _type: 'MULTI-CHOICES',
        _choices: [
          { _name: 'false', _alias: 'To modify', _class: 'label is-draft' },
          { _name: 'true', _alias: 'Modified', _class: 'label is-success' },
        ],
      });
    }

    this._tableInfos = {
      _selector: 'admin-scenario',
      _content: this._emails,
      _total: this._total,
      _clickIndex: 1,
      _isNoMinHeight: true,
      _columns: columns,
    };
  }

  public editEmail(email: any) {
    this._emailToEdit = email;
    this._emailToEdit.campaignId = this.campaignId;
    this._sidebar = {
      size: '726px',
      animate_state: 'active',
      title: this.isEditable ? 'Edit Workflow' : 'Workflow',
    };
  }

  public updateEmail(emailsObject: any) {
    this._setModified();

    this._campaignScenario.emails = this._campaignScenario.emails.map(
      (email: EmailTemplate) => {
        if (emailsObject.step === email.step) {
          email = emailsObject[email.language];
          email.status = email.modified ? email.modified.toString() : 'false';
          email.defaultSignatureName = 'Karine Caulfield';
        }
        return email;
      }
    );

    this.scenarioChange.emit(this._campaignScenario);
  }

  public deleteScenario() {
    this.deletedScenario.emit(this._campaignScenario);
    this._modalDelete = false;
  }

  public setDefaultScenario() {
    this.defaultScenario = this._campaignScenario.name;
    this.defaultScenarioChange.emit(this.defaultScenario);
  }

  public changeLanguage(value: string) {
    this._language = value;
    this._initTable();
  }

  private _setModified() {
    this._isModifiedEn = this._isModified('en');
    this._isModifiedFr = this._isModified('fr');
  }

  private _isModified(language: string) {
    return this._campaignScenario.emails.reduce((acc, current) => {
      return acc && (current.language != language || current.modified);
    }, true);
  }

  public onClickDelete() {
    this._modalDelete = true;
  }

  public getId(): string {
    return `${this._language}_${this._campaignScenario.name
      .replace(/\s/gi, '_')
      .toLowerCase()}`;
  }

  get tableInfos(): any {
    return this._tableInfos;
  }

  get signatures(): Array<EmailSignature> {
    return this._signatures;
  }

  get emailToEdit(): any {
    return this._emailToEdit;
  }

  set sidebar(value: SidebarInterface) {
    this._sidebar = value;
  }

  get sidebar(): SidebarInterface {
    return this._sidebar;
  }

  get modalDelete(): boolean {
    return this._modalDelete;
  }

  set modalDelete(value: boolean) {
    this._modalDelete = value;
  }

  get isModifiedEn(): boolean {
    return this._isModifiedEn;
  }

  get isModifiedFr(): boolean {
    return this._isModifiedFr;
  }

  get inCampaign(): boolean {
    return this._inCampaign;
  }

  get language(): string {
    return this._language;
  }

  get campaignScenario(): EmailScenario {
    return this._campaignScenario;
  }

  get localConfig(): Config {
    return this._localConfig;
  }

  set localConfig(value: Config) {
    this._localConfig = value;
  }
}
