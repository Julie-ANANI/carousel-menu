import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { User } from '../../../../models/user.model';
import { Table } from '../../../table/models/table';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Template } from '../../../sidebar/interfaces/template';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})

export class AdminUsersComponent implements OnInit {

  private _users: Array<User> = [];

  private _actions: string[] = [];

  private _usersToRemove: User[] = [];

  private _more: Template = {};

  private _tableInfos: Table = null;

  private _showDeleteModal = false;

  sidebarState = new Subject<string>();

  currentUser: User;

  private _total = 0;

  private _config = {
    fields: 'id companyName jobTitle created domain location firstName lastName',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  constructor(private _titleService: TranslateTitleService,
              private _userService: UserService,
              private _notificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this._titleService.setTitle('USERS.TITLE');
    this._actions = ['Action1', 'Action2', 'Action3'];
    this.loadUsers();
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  loadUsers(): void {
    this._userService.getAll(this._config).subscribe((users: any) => {
        this._users = users.result;
        this._total = users._metadata.totalCount;

        this._tableInfos = {
          _selector: 'admin-user',
          _title: 'COMMON.USERS',
          _content: this._users,
          _total: this._total,
          _isHeadable: true,
          _isFiltrable: true,
          _isDeletable: true,
          _isSelectable: true,
          _isEditable: true,
          _columns: [
            {_attrs: ['firstName', 'lastName'], _name: 'COMMON.NAME', _type: 'TEXT'},
            {_attrs: ['jobTitle'], _name: 'COMMON.JOBTITLE', _type: 'TEXT'},
            {_attrs: ['companyName'], _name: 'COMMON.COMPANY', _type: 'TEXT'},
            {_attrs: ['domain'], _name: 'COMMON.DOMAIN', _type: 'TEXT'},
            {_attrs: ['created'], _name: 'COMMON.CREATED', _type: 'DATE'}]
        };
      });
  }

  configChange(config: any) {
    this._config = config;
    this.loadUsers();
  }

  inviteUser(event: Event): void {
    event.preventDefault();
    // TODO
  }

  editUser(user: User) {
    const us = new User(user);
    this._userService.get(us.id).subscribe((value: any) => {
      this._more = {
        animate_state: 'active',
        title: 'COMMON.EDIT_USER',
        type: 'editUser'
      };
      this.currentUser = value;
    });
  }

  closeSidebar(value: string) {
    this.more.animate_state = value;
    this.sidebarState.next(this.more.animate_state);
  }

  userEditionFinish(user: User) {
    this._userService.updateOther(user)
      .subscribe(
        (_data: any) => {
          this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
          this._more = {animate_state: 'inactive', title: this._more.title};
          this.loadUsers();
        },
        (error: any) => {
          this._notificationsService.error('ERROR.ERROR', error.message);
        });
  }

  deleteUsersModal(users: User[]) {
    this._usersToRemove = [];
    this._showDeleteModal = true;
    users.forEach(value => this._usersToRemove.push(new User(value)));
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._showDeleteModal = false;
  }

  removeUsers() {
    for (const user of this._usersToRemove) {
      this.removeUser(user.id);
    }
    this._usersToRemove = [];
    this._showDeleteModal = false;
  }

  removeUser(userId: string) {
    this._userService.deleteUser(userId)
      .subscribe((foo: any) => {
        this.loadUsers();
      });
  }

  performActions(action: any) {
    this._actions.find(value => value === action._action)
      ? console.log('Execution de l\'action ' + action._action + ' sur les lignes ' + JSON.stringify(action._rows, null, 2))
      : console.log('l\'Action' + action + 'n\'existe pas !');
  }

  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get total(): number { return this._total; }
  get usersToRemove(): User[] { return this._usersToRemove; }
  get users() { return this._users; }
  get more(): any { return this._more; }
  get showDeleteModal(): boolean { return this._showDeleteModal; }
}
