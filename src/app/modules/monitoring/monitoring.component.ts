import {Component, OnInit} from '@angular/core';

import { MonitoringService } from '../../services/monitoring/monitoring.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../services/error/error-front.service';
import {TranslateNotificationsService} from '../../services/translate-notifications/translate-notifications.service';

@Component({
  selector: 'monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})

export class MonitoringComponent implements OnInit {

  private _status  = {
    'monitoring': 'offline',
    'umiApi': 'offline',
    'searchService': 'offline',
    'mailService': 'offline',
    'umiMatchingService': 'offline',
    'umiNlpService': 'offline',
    'communityApi': 'offline'
  };

  constructor( private _monitoringService: MonitoringService,
               private _translateNotificationsService: TranslateNotificationsService
  ) {}

  ngOnInit(): void {
    this._monitoringService.getService().pipe(first()).subscribe((response) => {
      response.forEach( (serviceName: string) => {
        this._status[serviceName] = 'ok';
      });
      this._status['monitoring'] = 'ok';
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  get status(): object {
    return this._status;
  }

  get Object(): any {
    return Object;
  }

}

