import { Component, Input, OnInit } from '@angular/core';
import { EmailTemplate } from '../../../../../../models/email-template';

@Component({
  selector: 'app-admin-edit-emails-step',
  templateUrl: 'admin-edit-emails-step.component.html',
  styleUrls: ['admin-edit-emails-step.component.scss']
})
export class AdminEditEmailsStep implements OnInit {

  @Input() emails: Array<EmailTemplate>;
  @Input() step: string;
  
  public STEPS = {
    FIRST: "Premier email",
    SECOND: "Première relance",
    THIRD: "Seconde relance",
    THANKS: "Email de remerciement",
  };

  constructor() { }
  
  ngOnInit() {
  }
  
  get size(): number { return this.emails.filter(e => e.content != null).length}
}
