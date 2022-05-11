import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';
import { Language } from "../../../../models/static-data/language";

@Component({
  selector: 'app-sidebar-workflow',
  templateUrl: './sidebar-workflow.component.html',
})


// TODO update this if the emailsObject have not multiling functionality.
// TODO see the example of AdminEmailsLibraryComponent
export class SidebarWorkflowComponent implements OnInit{

  @Input() isEditable = false;

  @Input() emailsObject: any = {};

  @Input() signatures: Array<EmailSignature> = [];

  @Input() inputLanguage = 'en';

  @Input() id = this.inputLanguage;

  @Input() innovationCardLanguages: Array<Language> = [];

  @Output() emailChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    console.log(this.emailsObject);
  }

  ngOnInit(): void {
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
