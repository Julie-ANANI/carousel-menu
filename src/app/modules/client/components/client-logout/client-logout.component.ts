import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-logout',
  templateUrl: './client-logout.component.html'
})
export class ClientLogoutComponent implements OnInit {

  constructor(private _authService: AuthService,
              private _location: Location,
              private _titleService: Title,
              private _notificationsService: TranslateNotificationsService) {}

  ngOnInit(): void {
    this._titleService.setTitle('Log out'); // TODO translate
    this._authService.logout()
      .subscribe(
        res => {
          this._notificationsService.success('ERROR.LOGIN.LOGOUT', 'ERROR.LOGIN.LOGOUT_TEXT');
          this._location.back();
        },
        error => {
          this._notificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
          this._location.back();
        });
  }

}
