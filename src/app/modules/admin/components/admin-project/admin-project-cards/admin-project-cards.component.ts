import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-admin-project-cards',
  templateUrl: 'admin-project-cards.component.html',
  styleUrls: ['admin-project-cards.component.scss']
})
export class AdminProjectCardsComponent implements OnInit {

  private _project: Innovation;
  private _formData: any = {};
  public shouldSave = false; // To prevent leaving page
  public lastSavedDate: Date;

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _notificationsService: TranslateNotificationsService) {}

  ngOnInit(): void {
    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
  }

  public save(event: Event): void {
    event.preventDefault();
    this._innovationService.save(this._project._id, this._formData)
      .first().subscribe((data: Innovation) => {
        this.lastSavedDate = new Date(data.updated);
        this.shouldSave = false;
      }, err => {
        this._notificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
  }

  public updateCards(event: any) {
    this.shouldSave = true;
    this._formData = event;
  }

  public updateProject(event: Innovation) {
    this._project = event;
  }

  public validateProject (): void {
    this._innovationService.validate(this._project._id).first().subscribe(_ => {
      this._notificationsService.success('Projet validé', 'Le projet a bien été validé');
    });
  }

  public askRevision (): void {
    this._innovationService.askRevision(this._project._id).first().subscribe(_ => {
      this._notificationsService.success('Projet en révision', 'Le projet a été passé en status de révision, veuillez avertir le propriétaire des chagements à effectuer');
    });
  }

  get project() {
    return this._project;
  }

}
