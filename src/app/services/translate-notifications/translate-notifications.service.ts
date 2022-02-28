/**
 * Created by bastien on 08/12/2017.
 */
import { Injectable } from '@angular/core';
import { NotificationsService, Notification } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class TranslateNotificationsService {

  constructor(private _translateService: TranslateService,
              private _notificationsService: NotificationsService) {
  }

  public error(title: string, message: string, config?: any): Notification {
    return this._notificationsService.error(
      title ? this._translateService.instant(title) : '',
      message ? this.formatErrorMessage(message) : '',
      config
    );
  }

  public success(title: string, message: string, config?: any): Notification {
    return this._notificationsService.success(
      title ? this._translateService.instant(title) : title,
      message ? this._translateService.instant(message) : message,
      config
    );
  }

  /**
   * if the error is not in Error system, display default error
   * @param message
   * @private
   */
  private formatErrorMessage(message: string) {
    message = this._translateService.instant(message);
    if (message.indexOf('ERROR.') !== -1) {
      message = this._translateService.instant('ERROR.OPERATION_ERROR');
    }
    return message;

  }


}
