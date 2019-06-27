import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { Preset } from '../../../../../../models/preset';
@Component({
  selector: 'app-admin-project-questionnaire',
  templateUrl: './admin-project-questionnaire.component.html',
  styleUrls: ['./admin-project-questionnaire.component.scss']
})
export class AdminProjectQuestionnaireComponent implements OnInit {

  private _project: Innovation;

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationService: TranslateNotificationsService,
              private _innovationService: InnovationService) {

    this._project = this._activatedRoute.snapshot.parent.data['innovation'];

  }

  ngOnInit(): void {
  }

  public savePreset(preset: Preset): void {
    const project = { preset: this._project.preset };
    this._innovationService.save(this._project._id, project).subscribe((result: any) => {
      this._notificationService.success('ERROR.SUCCESS', 'ERROR.PRESET.UPDATED');
      this._project = result;
    });
  }

  get project() { return this._project; }

}
