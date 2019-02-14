import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailScenario } from '../../../../../models/email-scenario';
import { EmailTemplate } from '../../../../../models/email-template';
import { SidebarInterface } from '../../../../sidebar/interfaces/sidebar-interface';
import { EmailSignature } from '../../../../../models/email-signature';

@Component({
  selector: 'app-admin-edit-workflow',
  templateUrl: 'admin-edit-workflow.component.html',
  styleUrls: ['admin-edit-workflow.component.scss']
})
export class AdminEditWorkflowComponent implements OnInit {

  @Input() scenario: EmailScenario;

  @Input() isDeletable: boolean = true;

  @Input() set signatures(value: Array<EmailSignature> ){
    this._signatures = value;
    this._initTable();
  }

  @Output() scenarioChange = new EventEmitter<EmailScenario>();

  @Output() deletedScenario = new EventEmitter<EmailScenario>();

  deleteModal: boolean = null;

  isModifiedEn: boolean = false;

  isModifiedFr: boolean = false;

  inCampaign: boolean = false;

  language = 'en';

  private _signatures: Array<EmailSignature> = [];

  private _emails: Array<any> = [];

  private _total: number = 0;

  private _emailToEdit: any;

  private _more: SidebarInterface = {};

  private _tableInfos: any;

  public config: any = {
    limit: '0',
    offset: '0',
    search: '{}',
    sort: '{}'
  };

  constructor() { }

  ngOnInit() {
    this.inCampaign = this.scenario.emails[0] && this.scenario.emails[0].modified != undefined;
    this._setModified();
    this._initTable();
  }

  private _initTable() {
    const steps = {
      FIRST: {step: "FIRST", num: "01 - "},
      SECOND: {step: "SECOND", num: "02 - "},
      THIRD: {step: "THIRD", num: "03 - "},
      THANKS: {step: "THANKS", num: "04 - "}
    };

    this.scenario.emails.forEach((email: EmailTemplate) => {
      steps[email.step][email.language] = email;
      email.signature = email.signature || {};
    });

    this._emails = [steps.FIRST, steps.SECOND, steps.THIRD, steps.THANKS];

    this._total = this.scenario.emails.length;

    let columns = [{_attrs: ['num', `${this.language}.subject`], _name: 'Step', _type: 'TEXT', _isSortable: false},
      {_attrs: [`${this.language}.content`], _name: 'Contenu', _type: 'TEXT', _isSortable: false},
      {_attrs: [`${this.language}.signature.name`], _name: 'Signature', _type: 'TEXT', _isSortable: false}];

    if (this.inCampaign) {
      columns.push({_attrs: [`${this.language}.modified`], _name: 'Modified', _type: 'CHECK', _isSortable: false});
    }

    this._tableInfos = {
      _selector: 'admin-scenario',
      _content: this._emails,
      _total: this._total,
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

  public closeSidebar(value: string) {
    this.more.animate_state = value;
  }

  public editEmail(email: any) {
    this._emailToEdit = email;
    this._more = {
      size: '650px',
      animate_state: this._more.animate_state === 'active' ? 'inactive' : 'active',
      title: this.scenario.name
    };
  }

  public updateEmail(emailsObject: any) {
    this._setModified();
    this.scenario.emails = this.scenario.emails.map((email: EmailTemplate) => {
      if(emailsObject.step === email.step) {
        email = emailsObject[email.language];
        if (emailsObject[email.language].signature) {
          const fullSignature = this._signatures.find(s => s.name === email.signature.name);
          email.signature = fullSignature || {};
        }
      }
      return email;
    });
    this.scenarioChange.emit(this.scenario);
  }

  public deleteScenario() {
    if (this.isDeletable) {
      this.deletedScenario.emit(this.scenario);
    }
  }

  public changeLanguage(value: string) {
    this.language = value;
    this._initTable();
  }

  private _setModified() {
    this.isModifiedEn = this._isModified('en');
    this.isModifiedFr = this._isModified('fr');
  }
  
  private _isModified(language: string) {
    return this.scenario.emails.reduce((acc, current) => {
      return (acc && (current.language != language || current.modified));
    }, true);
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

  get more(): any {
    return this._more;
  }

  set emailToEdit(value: any) {
    this._emailToEdit = value;
  }

}
