import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EmailTemplate } from '../../../../../../models/email-template';

@Component({
  selector: 'app-admin-edit-emails-step',
  templateUrl: 'admin-edit-emails-step.component.html',
  styleUrls: ['admin-edit-emails-step.component.scss']
})
export class AdminEditEmailsStep {

  @Input() emails: Array<EmailTemplate>;
  @Input() step: string;
  @Output() emailsChange = new EventEmitter<any>();

  public STEPS = {
    FIRST: "Premier email",
    SECOND: "Première relance",
    THIRD: "Seconde relance",
    THANKS: "Email de remerciement",
  };

  constructor() { }

  emailChange(email: EmailTemplate, i: number) {
    this.emails[i] = email;
    this.emailsChange.emit(this.emails);
  }
  
  get size(): number { return this.emails.filter(e => e.content != null).length}
}
