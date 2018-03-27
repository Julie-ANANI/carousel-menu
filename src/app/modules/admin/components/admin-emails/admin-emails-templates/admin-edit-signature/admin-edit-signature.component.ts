import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { EmailSignature } from '../../../../../../models/email-signature';

@Component({
  selector: 'app-admin-edit-signature',
  templateUrl: 'admin-edit-signature.component.html',
  styleUrls: ['admin-edit-signature.component.scss']
})
export class AdminEditSignatureComponent implements OnInit {

  private _signature: EmailSignature;
  public editionMode: boolean = false;
  public deleteModal: boolean = false;

  constructor(private _templatesService: TemplatesService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._signature = this._activatedRoute.snapshot.data['signature'];
  }

  public save(event: any) {
    this._templatesService.saveSignature(this._signature).first().subscribe(_ => {
      this._notificationsService.success("ERROR.SUCCESS", "ERROR.ACCOUNT.UPDATE");
    }, err => {
      this._notificationsService.error('ERROR', err);
    });
  }
  
  /**
   * Suppression et mise à jour de la vue
   */
  public removeSignature() {
    event.preventDefault();
    this._templatesService.removeSignature(this._signature._id).first().subscribe(_ => {
        this._router.navigate(['/admin/emails/templates']);
      });
  }

  get signature(): EmailSignature { return this._signature; }
  set signature(value: EmailSignature) { this._signature = value; }
}
