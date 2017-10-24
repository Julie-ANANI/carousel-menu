import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { initTranslation, TranslateService } from './i18n/i18n';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { MediaService } from '../../../../services/media/media.service';

@Component({
  selector: 'app-client-project',
  templateUrl: './client-project.component.html',
  styleUrls: ['./client-project.component.scss']
})
export class ClientProjectComponent implements OnInit {

  private _project: any;
  public idInnovationCard = 0;

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _notificationsService: NotificationsService,
              private _translateService: TranslateService,
              private _mediaService: MediaService) { }


  ngOnInit() {
    initTranslation(this._translateService);

    this._activatedRoute.params.subscribe(params => {
      const innovationId = params['innovationId'];

      this._innovationService.get(innovationId).subscribe(innovation => {
          this._project = innovation;
        },
        error => this._notificationsService.error('Error', error.message)
      );
    });
  }

  get project (): any {
    return this._project;
  }
}
