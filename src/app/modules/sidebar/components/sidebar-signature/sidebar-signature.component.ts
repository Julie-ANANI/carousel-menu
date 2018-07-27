import {Component, EventEmitter, Input, Output} from '@angular/core';
import { EmailSignature } from '../../../../models/email-signature';


@Component({
  selector: 'app-sidebar-signature',
  templateUrl: './sidebar-signature.component.html',
  styleUrls: ['./sidebar-signature.component.scss']
})
export class SidebarSignatureComponent {

  @Input() set signature(value: EmailSignature) {
    this._signature = value;
  }
  @Output() signatureChange = new EventEmitter<any>();

  private _signature: EmailSignature;
  public editionMode: boolean = true;

  constructor() {
  }
  public save() {
    this.signatureChange.emit(this._signature);
  }

  public updateContent(event: any) {
    this._signature.content = event.content;
  }

  get signature(): EmailSignature { return this._signature; }
}
