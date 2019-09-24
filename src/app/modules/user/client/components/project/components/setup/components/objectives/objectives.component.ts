import { Component, Input } from '@angular/core';
import { Innovation } from '../../../../../../../../../models/innovation';
import { InnovationService } from '../../../../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../../../../services/notifications/notifications.service';

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
              private _notificationsService: TranslateNotificationsService) {}

  saveObjectives(event: Event) {
    event.preventDefault();
    this._innovationService.save(this._innovation._id, {objectives: this._innovation.objectives}).subscribe((data: Innovation) => {
      this._innovation = data;
      this._notificationsService.success('ERROR.SUCCESS' , 'Project updated');
    }, (err: any) => {
      this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err.message);
    });
  }

  get innovation(): Innovation {
    return this._innovation;
  }

}
