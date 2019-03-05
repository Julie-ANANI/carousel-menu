import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Innovation } from '../../../../../../../../../models/innovation';
import { InnovPitch } from '../../../../../../../../../models/innov-pitch';

@Component({
  selector: 'app-pitch',
  templateUrl: 'pitch.component.html',
  styleUrls: ['pitch.component.scss']
})

export class PitchComponent {

  @Input() set project(value: Innovation) {
    this._innovationPitch = value;
    this._canEdit = value.status === 'EDITING';
  }

  @Output() pitchChange = new EventEmitter<Innovation>();

  private _innovationPitch: Innovation;

  private _canEdit = false;

  constructor() {}

  updatePitch(value: InnovPitch) {
    this.pitchChange.emit(value);
  }

  get innovationPitch() {
    return this._innovationPitch;
  }

  get canEdit() {
    return this._canEdit;
  }

}
