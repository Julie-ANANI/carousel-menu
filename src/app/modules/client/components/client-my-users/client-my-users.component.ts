import { Component, OnInit } from '@angular/core';
import { TranslateService, initTranslation } from './i18n/i18n';

@Component({
  selector: 'app-client-my-users',
  templateUrl: './client-my-users.component.html',
  styleUrls: ['./client-my-users.component.scss']
})
export class ClientMyUsersComponent implements OnInit {

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    initTranslation(this._translateService);
  }

}
