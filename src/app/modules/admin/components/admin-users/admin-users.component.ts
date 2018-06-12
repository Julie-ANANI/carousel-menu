import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { User } from '../../../../models/user.model';
import { Table } from '../../../shared/components/shared-table/models/table';
import {Types} from '../../../shared/components/shared-table/models/types';

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

  constructor(private _titleService: TranslateTitleService,
              private _userService: UserService,
              private _authService: AuthService) {}

  ngOnInit() {
    this._titleService.setTitle('USERS.TITLE');
    this._selfId = this._authService.userId;
    this.loadUsers(this._config);
  }

  getTableInfos(): Table
  {
    return {
      _title: 'COMMON.USERS',
      _content: this._users,
      _total: this._total,
      _columns: ['firstName', 'lastName', 'jobTitle', 'companyName'],
      _columnsNames: ['FIRSTNAME', 'LASTNAME', 'JOB', 'COMPANY'],
      _types: [Types.TEXT, Types.TEXT, Types.TEXT, Types.TEXT],
    };
  }

  loadUsers(config: any): void
  {
    this._config = config;
    this._userService.getAll(this._config)
      .first()
      .subscribe(users => {
        this._users = users.result;
        this._total = users._metadata.totalCount;
      });
  }

  inviteUser(event: Event): void {
    event.preventDefault();
    // TODO
  }

  editUser(user: User) {
    console.log(user);
  }

  get selfId(): string {
    return this._selfId;
  }

  public isSelf(id: string): boolean {
    return id && id === this.selfId;
  }

  loadInnovations(event: Event, userId: string): void {
    event.preventDefault();
    this._userService.getInnovations(userId)
      .first()
      .subscribe(innovations => {
        console.log(innovations.innovations);
      });
  }

  removeUsers(usersToRemove: User[]) {
    console.log(usersToRemove);
  }

  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get total(): number { return this._total; }
  get users() { return this._users; }
}
