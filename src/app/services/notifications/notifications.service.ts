/**
 * Created by bastien on 08/12/2017.
 */
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslateNotificationsService {

  constructor(private _translateService: TranslateService,
              private _notificationsService: NotificationsService) { }

    public error(title: string, message: string, config?: any) {
      this._translateService.get(title).subscribe((translatedTitle: string) => {
        this._translateService.get(message).subscribe((translatedMessage: string) => {
          return this._notificationsService.error(translatedTitle, translatedMessage, config);
        });
      });
    }
    public success(title: string, message: string, config?: any) {
      this._translateService.get(title).subscribe((translatedTitle: string) => {
        this._translateService.get(message).subscribe((translatedMessage: string) => {
          return this._notificationsService.success(translatedTitle, translatedMessage, config);
        });
      });
    }
}
