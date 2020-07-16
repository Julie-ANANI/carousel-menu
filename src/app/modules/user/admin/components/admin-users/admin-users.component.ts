import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../../../../services/user/user.service';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { User } from '../../../../../models/user.model';
import { Table } from '../../../../table/models/table';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { SidebarInterface } from '../../../../sidebars/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';
import { Config } from '../../../../../models/config';
import { Response } from '../../../../../models/response';
import { ConfigService } from '../../../../../services/config/config.service';
import { isPlatformBrowser } from '@angular/common';
import { RolesFrontService } from "../../../../../services/roles/roles-front.service";

@Component({
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})

export class AdminUsersComponent implements OnInit {

  private _config: Config = {
    fields: 'id company jobTitle created domain location firstName lastName',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  private _users: Array<User> = [];

  private _usersToRemove: Array<User> = [];

  private _sidebarValue: SidebarInterface = {};

  private _table: Table;

  private _modalDelete: boolean;

  private _selectedUser: User;

  private _total: number = -1;

  private _me: boolean = false;

  private _fetchingError: boolean;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _translateTitleService: TranslateTitleService,
              private _userService: UserService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.USERS');

  }

  ngOnInit(): void {

    if (isPlatformBrowser(this._platformId)) {

      this._config.limit = this._configService.configLimit('admin-user-limit');

      this._userService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
        this._users = response.result;
        this._total = response._metadata.totalCount;
        this._checkJuan();
        this._initializeTable();
      }, () => {
        this._fetchingError = true;
      });

    }
  }

  private _initializeTable() {
    this._table = {
      _selector: 'admin-user-limit',
      _title: 'users',
      _content: this._users,
      _total: this._total,
      _isSearchable: true,
      _isDeletable: this.canAccess(['users', 'profile', 'delete']),
      _isSelectable: this.canAccess(['users', 'profile', 'delete']),
      _isTitle: true,
      _isPaginable: true,
      _clickIndex: this.canAccess(['users', 'profile', 'view']) ? 1 : null,
      _columns: [
        {
          _attrs: ['firstName', 'lastName'],
          _name: 'Name',
          _type: 'TEXT',
          _isSearchable: true,
          _isSortable: true
        },
        {
          _attrs: ['email'],
          _name: 'Email Address',
          _type: 'TEXT',
          _isSearchable: true,
          _isSortable: true,
          _isHidden: true
        },
        {
          _attrs: ['jobTitle'],
          _name: 'Job',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['users', 'searchBy', 'job'])
        },
        {
          _attrs: ['company.name'],
          _name: 'Company',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['users', 'searchBy', 'enterprise'])
        },
        {
          _attrs: ['domain'],
          _name: 'Domain',
          _type: 'TEXT',
          _isSortable: true,
          _width: '200px',
          _isSearchable: this.canAccess(['users', 'searchBy', 'domain']),
          _isHidden: !this.canAccess(['users', 'tableColumns', 'domain'])
        },
        {
          _attrs: ['created'],
          _name: 'Created',
          _type: 'DATE',
          _isSortable: true,
          _width: '130px',
          _isHidden: !this.canAccess(['users', 'tableColumns', 'created'])
        }
      ]
    };
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(path);
  }

  private _getUsers() {
    this._userService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._users = response.result;
      this._total = response._metadata.totalCount;
      this._initializeTable();
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }

  private _checkJuan() {
    this._userService.getSelf().pipe(first()).subscribe((result) => {
      this._me = result && result.email === 'jdcruz-gomez@umi.us';
    }, err => {
      console.error(err);
    });
  }

  public onClickEdit(value: User) {
    const us = new User(value);

    this._userService.get(us.id).subscribe((response: User) => {
      this._selectedUser = response;

      this._sidebarValue = {
        animate_state: 'active',
        title: 'SIDEBAR.TITLE.EDIT_USER',
        type: 'editUser'
      };

    });
  }

  public updateUser(value: User) {
    this._userService.updateOther(value).pipe(first()).subscribe(() => {
      this._getUsers();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_UPDATE_TEXT');
      },
      () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public onClickDelete(users: Array<User>) {
    if (this.canAccess(['users', 'profile', 'delete'])) {
      this._usersToRemove = [];
      users.forEach(value => this._usersToRemove.push(new User(value)));
      this._modalDelete = true;
    }
  }

  public onClickConfirm() {

    for (const user of this._usersToRemove) {
      this._removeUser(user.id);
    }

    this._getUsers();
    this._modalDelete = false;
    this._usersToRemove = [];

  }

  private _removeUser(value: string) {
    this._userService.deleteUser(value).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_DELETE_TEXT');
    }, () => {
      this._translateNotificationsService.error('ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public synchronizeSRTUsers() {
    this._userService.createSwellUsers().pipe(first()).subscribe(response => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'All the users are updated.');
      this._getUsers();
      console.log(response);
      }, err => {
        console.error(err);
    });
  }

  // TODO
  inviteUser(event: Event): void {
    event.preventDefault();
  }

  public isJuan(): boolean {
    return this._me;
  }

  set config(value: Config) {
    this._config = value;
    this._getUsers();
    this._checkJuan();
  }

  get config(): Config {
    return this._config;
  }

  get table(): Table {
    return this._table;
  }

  get total(): number {
    return this._total;
  }

  get users() {
    return this._users;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  get selectedUser(): User {
    return this._selectedUser;
  }

  get modalDelete(): boolean {
    return this._modalDelete;
  }

  set modalDelete(value: boolean) {
    this._modalDelete = value;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get usersToRemove(): Array<User> {
    return this._usersToRemove;
  }

  get me(): boolean {
    return this._me;
  }

}
