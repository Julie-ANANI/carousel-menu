import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { NotificationsService } from 'angular2-notifications';
import { TranslateTitleService } from '../../../../services/title/title.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  private _users = [];
  private _total = 0;
  private _config = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  public pending_invitations = [
    // 'kcaulfield@umi.us',
    // 'hello@umi.us'
  ];

  constructor(private _router: Router,
              private _titleService: TranslateTitleService,
              private _userService: UserService,
              private _notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this._titleService.setTitle('USERS.TITLE');
    this.loadUsers(this._config);
  }

  loadUsers(config: any): void {
    this._config = config;
    this._userService.getAll(this._config).subscribe(users => {
      this._users = users.result;
      this._total = users._metadata.totalCount;
    });
  }

  inviteUser () {
    alert('TODO'); // TODO
  }
  loadInnovations(userId): void {
    this._userService.getInnovations(userId).subscribe(innovations => {
      console.log(innovations.innovations);
    });
  }

  set config(value: any) {
    this._config = value;
  }

  get config(): any {
    return this._config;
  }

  get total(): number {
    return this._total;
  }

  get users(): any[] {
    return this._users;
  }
}
