import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EmailService } from './../../../../services/email/email.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';


@Component({
  selector: 'app-shared-email-blacklist',
  templateUrl: 'shared-email-blacklist.component.html',
  styleUrls: ['shared-email-blacklist.component.scss']
})
export class SharedEmailBlacklistComponent implements OnInit {

  private _config = {
    limit: 10
  };

  constructor( private _emailService: EmailService,
               private _translateService: TranslateService,
               private _notificationsService: TranslateNotificationsService,) { }

  ngOnInit() {
    this._emailService.getBlacklist(this._config)
        .subscribe(result=>{
          console.log(result);
        }, error=>{
          console.error(error);
        });
    console.log(this._translateService);
    console.log(this._notificationsService);
  }

}
