import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EmailScenario } from '../../../../../models/email-scenario';
import { EmailTemplate } from '../../../../../models/email-template';
import { SidebarInterface } from '../../../../sidebar/interfaces/sidebar-interface';
import { EmailSignature } from '../../../../../models/email-signature';

@Component({
  selector: 'app-admin-edit-workflow',
  templateUrl: 'admin-edit-workflow.component.html',
  styleUrls: ['admin-edit-workflow.component.scss']
})
export class AdminEditWorkflowComponent {

  @Input() set scenario(value: EmailScenario) {
    this._campaignScenario = value;
    this._inCampaign = this._campaignScenario.emails[0] && this._campaignScenario.emails[0].modified != undefined;
    this._setModified();
    this._initTable();
  };

  @Input() isDeletable: boolean = true;

  @Input() set signatures(value: Array<EmailSignature> ){
    this._signatures = value;
    this._initTable();
  }

  @Output() scenarioChange = new EventEmitter<EmailScenario>();

  @Output() deletedScenario = new EventEmitter<EmailScenario>();

  private _modalDelete: boolean;

  private _isModifiedEn: boolean = false;

  private _isModifiedFr: boolean = false;

  private _inCampaign: boolean = false;

  private _language = 'en';

  private _signatures: Array<EmailSignature> = [];

  private _emails: Array<any> = [];

  private _total: number = 0;

  private _emailToEdit: any;

  private _more: SidebarInterface = {};

  private _tableInfos: any;

  private _campaignScenario: EmailScenario;

  public config: any = {
    limit: '0',
    offset: '0',
    search: '{}',
    sort: '{}'
  };

  constructor() { }


  private _initTable() {
    const steps = {
      FIRST: {step: "FIRST", num: "01 - "},
      SECOND: {step: "SECOND", num: "02 - "},
      THIRD: {step: "THIRD", num: "03 - "},
      THANKS: {step: "THANKS", num: "04 - "}
    };

    this._campaignScenario.emails.forEach((email: EmailTemplate) => {
      steps[email.step][email.language] = email;
      // email.signature = email.signature || {};
      email.defaultSignatureName = 'Karine Caulfield';
      email.status = email.modified.toString();
    });

    this._emails = [steps.FIRST, steps.SECOND, steps.THIRD, steps.THANKS];

    this._total = this._campaignScenario.emails.length;

    let columns = [{_attrs: ['num', `${this._language}.subject`], _name: 'TABLE.HEADING.EMAILS', _type: 'TEXT', _isSortable: false, _choices: null},
     // {_attrs: [`${this._language}.content`], _name: 'Contenu', _type: 'TEXT', _isSortable: false, _choices: null},
      {_attrs: [`${this._language}.defaultSignatureName`], _name: 'TABLE.HEADING.SIGNATURES', _type: 'TEXT', _isSortable: false, _choices: null}];

    if (this._inCampaign) {
      // columns.push({_attrs: [`${this._language}.modified`], _name: 'Modified', _type: 'CHECK', _isSortable: false, _choices: null});
      columns.push({_attrs: [`${this._language}.status`], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES',_isSortable: false, _choices: [
          {_name: 'false', _alias: 'TABLE.STATUS.TO_MODIFY', _class: 'label label-draft'},
          {_name: 'true', _alias: 'TABLE.STATUS.MODIFIED', _class: 'label label-success'},
        ]})
    }

    this._tableInfos = {
      _selector: 'admin-scenario',
      _content: this._emails,
      _total: this._total,
      _isNoTitle: true,
      _isHeadable: false,
      _isFiltrable: false,
      _isDeletable: false,
      _isSelectable: false,
      _isNotPaginable: true,
      _isEditable: true,
      _reloadColumns: true,
      _columns: columns
    };

  }


  public editEmail(email: any) {
    this._emailToEdit = email;

    this._more = {
      size: '726px',
      animate_state: this._more.animate_state === 'active' ? 'inactive' : 'active',
      title: 'COMMON.SIDEBAR.EDIT_WORKFLOW'
    };

  }


  public updateEmail(emailsObject: any) {
    this._setModified();

    this._campaignScenario.emails = this._campaignScenario.emails.map((email: EmailTemplate) => {
      if(emailsObject.step === email.step) {
        email = emailsObject[email.language];
        email.status = email.modified.toString();
        email.defaultSignatureName = 'Karine Caulfield';
        /*if (emailsObject[email.language].signature) {
          const fullSignature = this._signatures.find(s => s.name === email.signature.name);
          email.signature = fullSignature || {};
        }*/
      }
      return email;
    });

    this.scenarioChange.emit(this._campaignScenario);
  }


  public deleteScenario() {
    if (this.isDeletable) {
      this.deletedScenario.emit(this._campaignScenario);
      this._modalDelete = false;
    }
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
      return (acc && (current.language != language || current.modified));
    }, true);
  }


  onClickDelete() {
    this._modalDelete = true;
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

  set more(value: SidebarInterface) {
    this._more = value;
  }

  get more(): SidebarInterface {
    return this._more;
  }

  set emailToEdit(value: any) {
    this._emailToEdit = value;
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

}
