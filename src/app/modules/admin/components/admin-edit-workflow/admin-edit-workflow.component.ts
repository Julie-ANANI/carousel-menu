import { Component, OnInit, Input } from '@angular/core';
import { EmailScenario } from '../../../../models/email-scenario';
import { EmailTemplate } from '../../../../models/email-template';

@Component({
  selector: 'app-admin-edit-workflow',
  templateUrl: 'admin-edit-workflow.component.html',
  styleUrls: ['admin-edit-workflow.component.scss']
})
export class AdminEditWorkflowComponent implements OnInit {

  @Input() scenario: EmailScenario;

  private _emails: Array<any> = [];
  private _total: number = 0;
  private _tableInfos: any;
  public config: any = {
    limit: 0,
    offset: 0,
    search: {},
    sort: {}
  };

  constructor() {}

  ngOnInit() {
    const steps = {
      FIRST: {step: "First mail"},
      SECOND: {step: "Second mail"},
      THIRD: {step: "Third mail"},
      THANKS: {step: "Thanks mail"}
    };
    this.scenario.emails.forEach((email: EmailTemplate) => {
      steps[email.step][email.language] = email;
    });
    this._emails = [steps.FIRST, steps.SECOND, steps.THIRD, steps.THANKS];
    this._total = this.scenario.emails.length;
    let columns = [{_attrs: ['step'], _name: 'Step', _type: 'TEXT'},
      {_attrs: ['en.content'], _name: 'Contenu', _type: 'TEXT'},
      {_attrs: ['en.signature'], _name: 'Signature', _type: 'TEXT'}];
    if (this.scenario.emails[0] && this.scenario.emails[0].modified != undefined) {
      columns = columns.concat([
        {_attrs: ['en.modified'], _name: 'EN', _type: 'BOOLEAN'},
        {_attrs: ['fr.modified'], _name: 'FR', _type: 'BOOLEAN'}]);
    }
    this._tableInfos = {
      _selector: 'admin-scenario',
      _title: 'COMMON.EMAILS',
      _content: this._emails,
      _total: this._total,
      _isHeadable: true,
      _isFiltrable: false,
      _isDeletable: false,
      _isSelectable: false,
      _isEditable: true,
      _columns: columns
    };
  }
  
  public editEmail(email: any) {
    console.log(email);
  }

  get tableInfos(): any {
    return this._tableInfos;
  }
}
