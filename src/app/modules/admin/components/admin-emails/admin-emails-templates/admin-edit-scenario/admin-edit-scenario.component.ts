import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { EmailScenario } from '../../../../../../models/email-scenario';

@Component({
  selector: 'app-admin-edit-scenario',
  templateUrl: 'admin-edit-scenario.component.html',
  styleUrls: ['admin-edit-scenario.component.scss']
})
export class AdminEditScenarioComponent implements OnInit {

  private _scenario: EmailScenario;
  public deleteModal = false;

  constructor(private _templatesService: TemplatesService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe(_data => {
      this._scenario = this._activatedRoute.snapshot.data['scenario'];
    });
  }

  public updateScenario(scenario: EmailScenario) {
    this._templatesService.save(scenario).first().subscribe(updatedScenario => {
      this._scenario = updatedScenario;
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public removeScenario() {
    event.preventDefault();
    this._templatesService.remove(this._scenario._id).first().subscribe(_ => {
      this._router.navigate(['/admin/emails/templates']);
    });
  }

  get scenario(): EmailScenario { return this._scenario; }
  set scenario(value: EmailScenario) { this._scenario = value; }
}
