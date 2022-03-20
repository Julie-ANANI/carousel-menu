import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Picto, picto} from '../../../../../../models/static-data/picto';
import {MissionQuestion} from '../../../../../../models/mission';

@Component({
  selector: 'app-bluesquare',
  templateUrl: 'bluesquare.component.html'
})

export class BluesquareComponent {

  @Input() set subtitle(value: string) {
    this._subtitle = value;
  }

  @Input() percentage: number = null;

  @Input() readonly = true;

  private _question: MissionQuestion = <MissionQuestion>{};

  @Output() subtitleChanged = new EventEmitter<string>();

  private _editSubtitle = false;

  private _picto: Picto = picto;

  private _subtitle = '';

  constructor() {}

  public onChangeSubtitle() {
    this.subtitleChanged.emit(this._subtitle);
  }

  get editSubtitle(): boolean {
    return this._editSubtitle;
  }

  set editSubtitle(value: boolean) {
    this._editSubtitle = value;
  }

  get picto(): Picto {
    return this._picto;
  }

  get subtitle(): string {
    return this._subtitle;
  }

  get question(): MissionQuestion {
    return this._question;
  }
}
