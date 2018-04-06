import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EmailTemplate } from '../../../../models/email-template';

@Component({
  selector: 'app-shared-edit-emails-step',
  templateUrl: 'shared-edit-emails-step.component.html',
  styleUrls: ['shared-edit-emails-step.component.scss']
})
export class SharedEditEmailsStep {

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
    if (email == null) {
      this.emails.splice(i, 1);
    } else {
      this.emails[i] = email;
    }
    this.emailsChange.emit(this.emails);
  }
  
  get size(): number { return this.emails.filter(e => e.content != 'TODO' && e.subject != 'TODO').length}
}
