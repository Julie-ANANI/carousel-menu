import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../../../../../../models/innovation';
import { InnovationService } from '../../../../../../../../../services/innovation/innovation.service';
import { MissionService } from '../../../../../../../../../services/mission/mission.service';
import { TranslateNotificationsService } from '../../../../../../../../../services/notifications/notifications.service';
import { Mission } from '../../../../../../../../../models/mission';
import { environment } from '../../../../../../../../../../environments/environment';

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

  constructor(private _innovationService: InnovationService,
              private _missionService: MissionService,
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

  saveInnovation(event: Event) {
    event.preventDefault();
    const objectToSave = {external_diffusion: this._innovation.external_diffusion};
    this._innovationService.save(this._innovation._id, objectToSave).subscribe((innovation) => {
      this._innovation = innovation;
      this._notificationsService.success('ERROR.SUCCESS' , 'Project updated');
    }, (err: any) => {
      this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err.message);
    });
  }

  get mission(): Mission {
    return this._innovation.mission as Mission;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get companyName(): string {
    return environment.companyShortName;
  }

}
