import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonService } from '../../../../../services/common/common.service';

@Component({
  selector: 'executive-targeting',
  templateUrl: './executive-targeting.component.html',
  styleUrls: ['./executive-targeting.component.scss']
})

export class ExecutiveTargetingComponent {

  @Input() set targeting(value: string) {
    this._targeting = value || '';
    this.textColor();
  }

  @Output() targetingChange: EventEmitter<string> = new EventEmitter<string>();

  private _targeting = '';

  private _targetingColor = '';

  // todo targeting countries to send the map component;
  private _targetCountries: Array<string> = [];

  constructor() { }

  public emitChanges(event: Event) {
    event.preventDefault();
    this.targetingChange.emit(this._targeting);
  }

  public textColor() {
    this._targetingColor = CommonService.getLimitColor(this._targeting.length, 148);
  }

  get targeting(): string {
    return this._targeting;
  }

  get targetingColor(): string {
    return this._targetingColor;
  }

  get targetCountries(): Array<string> {
    return this._targetCountries;
  }

}
