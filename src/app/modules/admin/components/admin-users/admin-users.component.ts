import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  private _users: Array<User> = [];
  private _selfId = '';
  private _total = 0;
  private _config = {
    fields: 'companyName jobTitle created domain firstName lastName',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private _router: Router,
              private _titleService: TranslateTitleService,
              private _userService: UserService,
              private _authService: AuthService) {}

  ngOnInit(): void {
    this._titleService.setTitle('USERS.TITLE');
    this._selfId = this._authService.userId;
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
    // TODO
  }

  get selfId(): string {
    return this._selfId;
  }

  public isSelf(id: string): boolean {
    return id && id === this.selfId;
  }

  loadInnovations(userId: string): void {
    this._userService.getInnovations(userId).subscribe(innovations => {
      console.log(innovations.innovations);
    });
  }

  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get total(): number { return this._total; }
  get users() { return this._users; }
}
