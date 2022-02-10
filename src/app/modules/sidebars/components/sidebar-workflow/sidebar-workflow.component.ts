import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';
import {EmailObject} from '../../../../models/email';

@Component({
  selector: 'app-sidebar-workflow',
  templateUrl: './sidebar-workflow.component.html',
})

export class SidebarWorkflowComponent {

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  @Input() isEditable = false;

  @Input() emailObject: EmailObject = <EmailObject>{};

  @Input() signatures: Array<EmailSignature> = [];

  @Input() inputLanguage = 'en';

  @Input() id = this.inputLanguage;

  @Input() innovationCardLanguages: string [] = [];

  @Output() emailChange: EventEmitter<any> = new EventEmitter<any>();

  private _toBeSaved = false;

  constructor() {
  }

  public onClickSave() {
    if (this.isEditable) {
      this.emailObject[this.inputLanguage].modified = true;
      this.emailChange.emit(this.emailObject);
      this._toBeSaved = false;
    }
  }

  public onChangeEmail(value: any) {
    this.emailObject = value;
    this._toBeSaved = true
  }

}
