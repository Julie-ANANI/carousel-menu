import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { User } from '../../../../models/user.model';
import { Table } from '../../../shared/components/shared-table/models/table';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  private _users: Array<User> = [];
  private _actions: string[] = [];
  private _tableInfos: Table = null;
  private _selfId = '';
  private _total = 0;
  private _config = {
    fields: 'companyName jobTitle created domain firstName lastName isOperator',
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
    this._actions = ['Action1', 'Action2', 'Action3'];
    this.loadUsers(this._config);
  }

  get tableInfos(): Table
  {
    return this._tableInfos;
  }

  loadUsers(config: any): void
  {
    this._config = config;
    this._userService.getAll(this._config)
      .first()
      .subscribe(users => {
        this._users = users.result;
        this._total = users._metadata.totalCount;

        this._tableInfos = {
          _selector: 'admin-user',
          _title: 'COMMON.USERS',
          _content: this._users,
          _total: this._total,
          _isSelectable: true,
          _isEditable: true,
          _isDeletable: true,
          _columns: [
            {_attr: 'firstName', _name: 'FIRSTNAME', _type: 'TEXT'},
            {_attr: 'lastName', _name: 'LASTNAME', _type: 'TEXT'},
            {_attr: 'jobTitle', _name: 'JOB', _type: 'TEXT'},
            {_attr: 'companyName', _name: 'COMPANY', _type: 'TEXT'},
            {_attr: 'isOperator', _name: 'EST-OPERATEUR', _type: 'CHECK'}],
          _actions: this._actions
        };
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

  performActions(action: any) {
    this._actions.find(value => value === action._action)
      ? console.log('Execution de l\'action ' + action._action + ' sur les lignes ' + JSON.stringify(action._rows, null, 2))
      : console.log('l\'Action' + action + 'n\'existe pas !');
  }

  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get total(): number { return this._total; }
  get users() { return this._users; }
}
