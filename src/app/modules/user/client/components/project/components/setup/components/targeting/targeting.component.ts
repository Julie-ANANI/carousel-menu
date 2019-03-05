import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Innovation } from '../../../../../../../../../models/innovation';
import { InnovationSettings } from '../../../../../../../../../models/innov-settings';

@Component({
  selector: 'app-targeting',
  templateUrl: 'targeting.component.html',
  styleUrls: ['targeting.component.scss']
})

export class TargetingComponent {

  @Input() set project(value: Innovation) {
    if (value) {
      this._innovationSettings = value.settings;
      this._canEdit = value.status === 'EDITING';
    }
  }

  @Output() settingsChange = new EventEmitter<InnovationSettings>();

  private _innovationSettings: InnovationSettings;

  private _canEdit = false;

  constructor() {}

  updateSettings(value: InnovationSettings) {
    this.settingsChange.emit(value);
  }

  get innovationSettings(): InnovationSettings {
    return this._innovationSettings;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

}
