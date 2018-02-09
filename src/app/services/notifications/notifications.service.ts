/**
 * Created by bastien on 08/12/2017.
 */
import { Injectable } from '@angular/core';
import { NotificationsService, Notification } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslateNotificationsService {

  constructor(private _translateService: TranslateService,
              private _notificationsService: NotificationsService) { }

  public error(title: string, message: string, config?: any): Notification {
    return this._notificationsService.error(
      this._translateService.instant(title),
      this._translateService.instant(message),
      config);
  }

  public success(title: string, message: string, config?: any): Notification {
    return this._notificationsService.success(
      this._translateService.instant(title),
      this._translateService.instant(message),
      config);
  }

}
