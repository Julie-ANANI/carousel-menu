import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MissionService } from '../../../../services/mission/mission.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Mission } from '../../../../models/mission';

@Component({
  selector: 'app-mission-form',
  templateUrl: './mission-form.component.html',
  styleUrls: ['./mission-form.component.scss']
})

export class MissionFormComponent {

  @Input() set mission(value: Mission) {
    if (!!value) {
      this._missionForm.patchValue({_id: value._id, name: value.name, goal: value.goal});
      /* format dates */
      this._missionForm.controls.milestoneDates = this.formBuilder.array(
        value.milestoneDates.map((milestone) => {
          return new FormGroup({
            name: new FormControl(milestone.name),
            dueDate: new FormControl(new Date(milestone.dueDate).toISOString().slice(0, 10))
          });
        })
      );
    }
  }

  @Output() missionChange = new EventEmitter<Mission>();

  private _missionForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private missionService: MissionService,
              private translateNotificationsService: TranslateNotificationsService) {
    this._missionForm = this.formBuilder.group( {
      _id: new FormControl(''),
      name: new FormControl(''),
      goal: new FormControl(''),
      milestoneDates: new FormArray([])
    });
  }

  newMilestone(event: Event) {
    event.preventDefault();
    this.milestoneDates.push(new FormGroup({ name: new FormControl(''), dueDate: new FormControl('') }));
  }

  removeMilestone(event: Event, index: number) {
    event.preventDefault();
    this.milestoneDates.removeAt(index);
  }

  onSave(event: Event) {
    event.preventDefault();
    const mission: Mission = this._missionForm.getRawValue();
    this.missionService.save(mission._id, mission).subscribe((savedMission) => {
      this.missionChange.emit(savedMission);
      this.translateNotificationsService.success('ERROR.SUCCESS', 'SUCCESS');
    }, (err) => {
      this.translateNotificationsService.error('ERROR.SUCCESS', err.message);
    });
  }

  get missionForm(): FormGroup {
    return this._missionForm;
  }

  get milestoneDates(): FormArray {
    return this._missionForm.get('milestoneDates') as FormArray;
  }

}
