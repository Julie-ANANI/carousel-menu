import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-bluesquare',
  templateUrl: 'bluesquare.component.html',
  styleUrls: ['bluesquare.component.scss']
})

export class BluesquareComponent {

  @Input() numberFocus: number = null

  @Input() subtitle = '';

  @Input() percentage: number = null;

  @Input() readonly = true;

  @Output() subtitleChanged = new EventEmitter<string>();

  private _editSubtitle = false;

  constructor() {}

  get editSubtitle(): boolean {
    return this._editSubtitle;
  }

  set editSubtitle(value: boolean) {
    this._editSubtitle = value;
  }
}
