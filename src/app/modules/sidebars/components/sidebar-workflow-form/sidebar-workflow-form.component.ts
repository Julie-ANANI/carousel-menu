import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';

@Component({
  selector: 'app-sidebar-workflow',
  templateUrl: './sidebar-workflow-form.component.html',
  styleUrls: ['./sidebar-workflow-form.component.scss']
})

export class SidebarWorkflowFormComponent {

  @Input() isEditable = false;

  @Input() emailsObject: any = {};

  @Input() signatures: Array<EmailSignature> = [];

  @Input() inputLanguage = 'en';

  @Input() set id(value: string) {
    this._id = value || this.inputLanguage;
  }

  @Output() emailChange: EventEmitter<any> = new EventEmitter<any>();

  private _id = '';

  constructor() { }

  public onClickSave() {
    this.emailsObject[this.inputLanguage].modified = true;
    this.emailChange.emit(this.emailsObject);
  }

  public onChangeEmail(value: any) {
    this.emailsObject = value;
  }

  get id(): string {
    return this._id;
  }

}
