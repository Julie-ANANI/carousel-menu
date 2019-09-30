import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../../../../../../models/innovation';
import { MissionService } from '../../../../../../../../../services/mission/mission.service';
import { TranslateNotificationsService } from '../../../../../../../../../services/notifications/notifications.service';
import { Mission } from '../../../../../../../../../models/mission';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})

export class ObjectivesComponent {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  @Input() editable: boolean;

  private _innovation: Innovation;

  constructor(private _missionService: MissionService,
              private _notificationsService: TranslateNotificationsService) {}

  saveObjectives(event: Event) {
    event.preventDefault();
    this._missionService.save(this.mission._id, {goal: this.mission.goal}).subscribe((data: Innovation) => {
      this._innovation.mission = data;
      this._notificationsService.success('ERROR.SUCCESS' , 'Project updated');
    }, (err: any) => {
      this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err.message);
    });
  }

  get mission(): Mission {
    return this._innovation.mission as Mission;
  }

}
