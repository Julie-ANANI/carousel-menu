import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';
import {EmailObject} from '../../../../models/email';

@Component({
  selector: 'app-sidebar-workflow',
  templateUrl: './sidebar-workflow.component.html',
})


// TODO update this if the emailsObject have not multiling functionality.
// TODO see the example of AdminEmailsLibraryComponent
export class SidebarWorkflowComponent implements OnInit{

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  @Input() isEditable = false;

  @Input() emailObject: EmailObject = <EmailObject>{};

  @Input() signatures: Array<EmailSignature> = [];

  @Input() set inputLanguage(value: string){
    if(value){
      this._inputLanguage = value;
    }
  }

  @Input() id = 'en';

  @Input() innovationCardLanguages: Array<string> = [];

  @Output() emailChange: EventEmitter<any> = new EventEmitter<any>();

  private _toBeSaved = false;

  private _inputLanguage = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  public onClickSave() {
    if (this.isEditable) {
      this.emailObject[this.inputLanguage].modified = true;
      this.emailChange.emit(this.emailObject);
      this._toBeSaved = false;
    }
  }

  get inputLanguage(): string {
    return this._inputLanguage;
  }


  public onChangeEmail(value: any) {
    this.emailObject = value;
    this._toBeSaved = true
  }

}
