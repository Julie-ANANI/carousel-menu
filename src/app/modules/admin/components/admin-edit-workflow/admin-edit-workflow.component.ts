import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailScenario } from '../../../../models/email-scenario';
import { EmailTemplate } from '../../../../models/email-template';
import { Template } from '../../../shared/components/shared-sidebar/interfaces/template';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TemplatesService } from '../../../../services/templates/templates.service';

@Component({
  selector: 'app-admin-edit-workflow',
  templateUrl: 'admin-edit-workflow.component.html',
  styleUrls: ['admin-edit-workflow.component.scss']
})
export class AdminEditWorkflowComponent implements OnInit {

  @Input() scenario: EmailScenario;
  @Output() deletedScenario = new EventEmitter<string>();

  public deleteModal: boolean = null;
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

  constructor(private _notificationsService: TranslateNotificationsService,
              private _templatesService: TemplatesService) {}

  ngOnInit() {
    const steps = {
      FIRST: {step: "01 - "},
      SECOND: {step: "02 -"},
      THIRD: {step: "03 - "},
      THANKS: {step: "04 - "}
    };
    this.scenario.emails.forEach((email: EmailTemplate) => {
      steps[email.step][email.language] = email;
    });
    this._emails = [steps.FIRST, steps.SECOND, steps.THIRD, steps.THANKS];
    this._total = this.scenario.emails.length;
    let columns = [{_attrs: ['step', 'en.subject'], _name: 'Step', _type: 'TEXT', _isSortable: false},
      {_attrs: ['en.content'], _name: 'Contenu', _type: 'TEXT', _isSortable: false},
      {_attrs: ['en.signature'], _name: 'Signature', _type: 'TEXT', _isSortable: false}];
    if (this.scenario.emails[0] && this.scenario.emails[0].modified != undefined) {
      columns = columns.concat([
        {_attrs: ['en.modified'], _name: 'EN', _type: 'BOOLEAN', _isSortable: false},
        {_attrs: ['fr.modified'], _name: 'FR', _type: 'BOOLEAN', _isSortable: false}]);
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
      _columns: columns
    };
  }

  public closeSidebar(value: string) {
    this.more.animate_state = value;
  }

  public editEmail(email: any) {
    this._emailToEdit = email;
    this._more = {
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

    this._templatesService.save(this.scenario).first().subscribe(updatedScenario => {
      this.scenario = updatedScenario;
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }
  
  public deleteScenario() {
    this.deletedScenario.emit(this.scenario._id);
  }

  get tableInfos(): any {
    return this._tableInfos;
  }
  get emailToEdit(): any { return this._emailToEdit; }
  get more(): any { return this._more; }
  set emailToEdit(value: any) { this._emailToEdit = value; }
}
