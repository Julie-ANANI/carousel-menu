import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Picto, picto} from '../../../../../../models/static-data/picto';

@Component({
  selector: 'app-bluesquare',
  templateUrl: 'bluesquare.component.html',
  styleUrls: ['bluesquare.component.scss']
})

export class BluesquareComponent {

  @Input() subtitle = '';

  @Input() percentage: number = null;

  @Input() readonly = true;

  @Output() subtitleChanged = new EventEmitter<string>();

  private _editSubtitle = false;

  private _picto: Picto = picto;

  constructor() {}

  get editSubtitle(): boolean {
    return this._editSubtitle;
  }

  set editSubtitle(value: boolean) {
    this._editSubtitle = value;
  }

  get picto(): Picto {
    return this._picto;
  }
}
