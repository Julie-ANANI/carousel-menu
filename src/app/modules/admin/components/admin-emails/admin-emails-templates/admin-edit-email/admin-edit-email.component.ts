import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EmailTemplate } from '../../../../../../models/email-template';

@Component({
  selector: 'app-admin-edit-email',
  templateUrl: 'admin-edit-email.component.html',
  styleUrls: ['admin-edit-email.component.scss']
})
export class AdminEditEmail {

  @Input() email: EmailTemplate;
  @Output() emailChange = new EventEmitter<any>();

  public editionMode: boolean = false;
  public STEPS = {
    FIRST: "Premier email",
    SECOND: "Première relance",
    THIRD: "Seconde relance",
    THANKS: "Email de remerciement",
  };

  constructor() { }

  public addEmail(email: EmailTemplate) {
    console.log(email);
  }

  public save() {
    this.emailChange.emit(this.email);
  }
}
