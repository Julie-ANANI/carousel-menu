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
      title ? this._translateService.instant(title) : '',
      message ? this._translateService.instant(message) : '',
      config);
  }

  public success(title: string, message: string, config?: any): Notification {
    return this._notificationsService.success(
      title ? this._translateService.instant(title) : title,
      message ? this._translateService.instant(message) : message,
      config);
  }

}
