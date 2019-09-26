import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Mission } from '../../../../models/mission';

@Component({
  selector: 'app-mission-form',
  templateUrl: './mission-form.component.html',
  styleUrls: ['./mission-form.component.scss']
})

export class MissionFormComponent {

  @Input() set mission(value: Mission) {
    if (!!value) {
      this._missionForm.patchValue(value);
    }
  }

  @Output() missionChange = new EventEmitter<Mission>();

  private _missionForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this._missionForm = this.formBuilder.group( {
      name: [''],
    });
  }

  onSave(event: Event) {
    event.preventDefault();
    console.log(this._missionForm.getRawValue());
  }

  get missionForm(): FormGroup {
    return this._missionForm;
  }

}
