import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailScenario } from '../../../../models/email-scenario';
import { EmailTemplate } from '../../../../models/email-template';
import { Template } from '../../../sidebar/interfaces/template';
import { EmailSignature } from '../../../../models/email-signature';

@Component({
  selector: 'app-admin-edit-workflow',
  templateUrl: 'admin-edit-workflow.component.html',
  styleUrls: ['admin-edit-workflow.component.scss']
})
export class AdminEditWorkflowComponent implements OnInit {

  @Input() scenario: EmailScenario;
  @Input() set signatures(value: Array<EmailSignature> ){
    this._signatures = value;
    this._initTable();
  }
  @Output() scenarioChange = new EventEmitter<EmailScenario>();
  @Output() deletedScenario = new EventEmitter<string>();

  public deleteModal: boolean = null;
  public language = 'en';
  private _signatures: Array<EmailSignature> = [];
  private _emails: Array<any> = [];
  private _total: number = 0;
  private _emailToEdit: any;
  private _more: Template = {};
  private _tableInfos: any;
  public config: any = {
    limit: 0,
    offset: 0,
    search: {},
    sort: {}
  };

  constructor() {}

  ngOnInit() {
    this._initTable();
  }

  private _initTable() {
    const steps = {
      FIRST: {step: "01 - "},
      SECOND: {step: "02 -"},
      THIRD: {step: "03 - "},
      THANKS: {step: "04 - "}
    };
    this.scenario.emails.forEach((email: EmailTemplate) => {
      if (email.signature) {
        const fullSignature = this._signatures.find(s => s._id === email.signature.toString());
        if (fullSignature) email.signatureName = fullSignature.name;  
      }
      steps[email.step][email.language] = email;
    });
    this._emails = [steps.FIRST, steps.SECOND, steps.THIRD, steps.THANKS];
    this._total = this.scenario.emails.length;
    let columns = [{_attrs: ['step', `${this.language}.subject`], _name: 'Step', _type: 'TEXT', _isSortable: false},
      {_attrs: [`${this.language}.content`], _name: 'Contenu', _type: 'TEXT', _isSortable: false},
      {_attrs: [`${this.language}.signatureName`], _name: 'Signature', _type: 'TEXT', _isSortable: false}];
    if (this.scenario.emails[0] && this.scenario.emails[0].modified != undefined) {
      columns.push({_attrs: [`${this.language}.modified`], _name: 'Modified', _type: 'BOOLEAN', _isSortable: false});
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
    this.scenario.emails = this.scenario.emails.map((email: EmailTemplate) => {
      if(emailsObject.step === email.step) {
        email = emailsObject[email.language];
      }
      return email;
    });
    
    this.scenarioChange.emit(this.scenario);
  }

  public deleteScenario() {
    this.deletedScenario.emit(this.scenario._id);
  }

  public changeLanguage(value: string) {
    this.language = value;
    this._initTable();
  }

  get tableInfos(): any { return this._tableInfos; }
  get signatures(): Array<EmailSignature> { return this._signatures; }
  get emailToEdit(): any { return this._emailToEdit; }
  get more(): any { return this._more; }
  set emailToEdit(value: any) { this._emailToEdit = value; }
}
