import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Innovation } from '../../../../../../../../../models/innovation';

@Component({
  selector: 'app-pitch',
  templateUrl: 'pitch.component.html',
  styleUrls: ['pitch.component.scss']
})

export class PitchComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._innovationPitch = value;
    this._canEdit = value.status === 'EDITING' || value.status === 'SUBMITTED';
  }

  @Output() pitchChange = new EventEmitter<Innovation>();

  private _innovationPitch: Innovation;

  private _canEdit = false;

  constructor() {}

  ngOnInit(): void {
  }

  updatePitch(value: Innovation) {
    this.pitchChange.emit(value);
  }

  get innovationPitch() {
    return this._innovationPitch;
  }

  get canEdit() {
    return this._canEdit;
  }

}
