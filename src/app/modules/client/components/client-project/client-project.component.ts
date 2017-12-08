import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';

@Component({
  selector: 'app-client-project',
  templateUrl: './client-project.component.html',
  styleUrls: ['./client-project.component.scss']
})
export class ClientProjectComponent implements OnInit {
  
  @Input() project: any;

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _notificationsService: TranslateNotificationsService) { }


  ngOnInit() {
    if (!this.project) {
      this._activatedRoute.params.subscribe(params => {
        const innovationId = params['innovationId'];

        this._innovationService.get(innovationId).subscribe(innovation => {
            this.project = innovation;
          },
          error => this._notificationsService.error('ERROR.ERROR', error.message)
        );
      });
    }
  }
}
