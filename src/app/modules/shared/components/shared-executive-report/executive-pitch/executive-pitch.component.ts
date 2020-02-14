import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonService } from '../../../../../services/common/common.service';

@Component({
  selector: 'executive-pitch',
  templateUrl: './executive-pitch.component.html',
  styleUrls: ['./executive-pitch.component.scss']
})

export class ExecutivePitchComponent {

  @Input() set pitch(value: string) {
    this._pitch = value || '';
  }

  @Output() pitchChange: EventEmitter<string> = new EventEmitter<string>();

  private _pitch = '';

  private _pitchColor = CommonService.getLimitColor(this._pitch.length, 216);

  constructor() { }

  public emitChanges(event: Event) {
    event.preventDefault();
    this.pitchChange.emit(this._pitch);
  }

  public textColor() {
    this._pitchColor = CommonService.getLimitColor(this._pitch.length, 216);
  }

  get pitch(): string {
    return this._pitch;
  }

  get pitchColor(): string {
    return this._pitchColor;
  }

}
