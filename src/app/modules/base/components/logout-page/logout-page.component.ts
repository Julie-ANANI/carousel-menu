import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Location } from '@angular/common';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout-page.component.html',
  styleUrls: ['./logout-page.component.scss']
})

export class LogoutPageComponent implements OnInit {

  constructor(private _authService: AuthService,
              private _location: Location,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit(): void {
    this._translateTitleService.setTitle('LOG_OUT.TITLE');

    this._authService.logout().pipe(first()).subscribe(
      (_: any) => {
          this._translateNotificationsService.success('ERROR.LOGIN.LOGOUT', 'ERROR.LOGIN.LOGOUT_TEXT');
          this._location.back();
        },
      (_: any) => {
          this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
          this._location.back();
        });
  }

}
