import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';

@Component({
  selector: 'app-sidebar-workflow',
  templateUrl: './sidebar-workflow.component.html',
  styleUrls: ['./sidebar-workflow.component.scss']
})

export class SidebarWorkflowComponent {

  @Input() isEditable = false;

  @Input() emailsObject: any = {};

  @Input() signatures: Array<EmailSignature> = [];

  @Input() inputLanguage = 'en';

  @Input() id = this.inputLanguage;

  @Input() innovationCardLanguages: string [] = [];

  @Output() emailChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  public onClickSave() {
    if (this.isEditable) {
      this.emailsObject[this.inputLanguage].modified = true;
      this.emailChange.emit(this.emailsObject);
    }
  }

  public onChangeEmail(value: any) {
    this.emailsObject = value;
  }

}
