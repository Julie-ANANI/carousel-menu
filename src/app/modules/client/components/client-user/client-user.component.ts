import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SmartQueryService } from '../../../../services/smartQuery/smartQuery.service';
import { UserService } from '../../../../services/user/user.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-user',
  templateUrl: './client-user.component.html',
  styleUrls: ['./client-user.component.styl']
})
export class ClientUserComponent implements OnInit {

  private _users = [];
  private _total = 0;

  constructor(private _router: Router,
              private _translateService: TranslateService,
              private _titleService: Title,
              private _sq: SmartQueryService,
              private _userService: UserService,
              private _notificationsService: NotificationsService) {
    this._sq.setRoute('/user');
  }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('Users'); // TODO translate

    this._sq.data$.subscribe(users => {
      this._users = users.result;
      this._total = users._metadata.totalCount;
    });
    this._sq.getData();
  }

  loadInnovations(userId): void {
    this._userService.getInnovations(userId).subscribe(innovations => {
      console.log(innovations.innovations);
    });
  }

  get sq(): any {
    return this._sq;
  }

  get total(): number {
    return this._total;
  }

  get users(): any[] {
    return this._users;
  }
}
