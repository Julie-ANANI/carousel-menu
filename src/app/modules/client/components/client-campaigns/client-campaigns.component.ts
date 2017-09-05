import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-campaigns',
  templateUrl: './client-campaigns.component.html',
  styleUrls: ['./client-campaigns.component.styl']
})
export class ClientCampaignsComponent implements OnInit {


  constructor(private _authService: AuthService,
              private _router: Router,
              private _translateService: TranslateService,
              private _titleService: Title,
              private _notificationsService: NotificationsService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('Campaigns'); // TODO translate
  }

  get authService (): AuthService {
    return this._authService;
  }
}
