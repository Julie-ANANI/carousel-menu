import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../../../../services/user/user.service';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { User } from '../../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../../services/translate-notifications/translate-notifications.service';
import { first } from 'rxjs/operators';
import { Response } from '../../../../../models/response';
import { isPlatformBrowser } from '@angular/common';
import { RolesFrontService } from '../../../../../services/roles/roles-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import {Table, UmiusConfigInterface, UmiusConfigService, UmiusSidebarInterface} from '@umius/umi-common-component';

@Component({
  templateUrl: './admin-users.component.html',
})

export class AdminUsersComponent implements OnInit {

  private _config: UmiusConfigInterface = {
    fields: 'id company jobTitle created domain location firstName lastName attempts emailVerified isOperator phone' +
      ' language roles state name country email',
    limit: this._configService.configLimit('admin-users-limit'),
    offset: '0',
    search: '{}',
    roles: JSON.stringify({'$ne': 'root'}),
    sort: '{ "created": -1 }'
  };

  private _users: Array<User> = [];

  private _usersToRemove: Array<User> = [];

  private _sidebarValue: UmiusSidebarInterface = <UmiusSidebarInterface>{};

  private _table: Table = <Table>{};

  private _modalDelete = false;

  private _selectedUser: User = <User>{};

  private _total = -1;

  private _isJuan = false;

  private _fetchingError = false;

  private _isLoading = true;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: UmiusConfigService,
              private _translateTitleService: TranslateTitleService,
              private _userService: UserService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._translateTitleService.setTitle('Users');

  }

  ngOnInit(): void {
    this._initializeTable();
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._getUsers();
    }
  }

  private _getUsers() {
    this._userService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._users = response && response.result || [];
      this._total = response && response._metadata && response._metadata.totalCount || 0;
      this._checkJuan();
      this._initializeTable();
    }, (err: HttpErrorResponse) => {
      console.log(err);
      this._translateNotificationsService.error('Error', ErrorFrontService.getErrorKey(err.error));
      this._isLoading = false;
      this._fetchingError = true;
      console.error(err);
    });
  }

  private _checkJuan() {
    this._userService.getSelf().pipe(first()).subscribe((result) => {
      this._isJuan = result && result.email === 'jdcruz-gomez@umi.us';
    }, (err: HttpErrorResponse) => {
      console.error(err);
    });
  }

  private _initializeTable() {
    this._table = {
      _selector: 'admin-users-limit',
      _title: 'users',
      _content: this._users,
      _total: this._total,
      _isSearchable: !!this.canAccess(['searchBy']),
      _isDeletable: this.canAccess(['user', 'delete']),
      _isSelectable: this.canAccess(['user', 'delete']),
      _isTitle: true,
      _isPaginable: true,
      _clickIndex: this.canAccess(['user', 'view']) || this.canAccess(['user', 'edit']) ? 1 : null,
      _columns: [
        {
          _attrs: ['firstName', 'lastName'],
          _name: 'Name',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'name']),
          _isHidden: !this.canAccess(['tableColumns', 'name']),
          _isSortable: true,
          _searchTooltip: 'Utilisez \"prénom,nom\" pour faire des recherches de personnes'
        },
        {
          _attrs: ['email'],
          _name: 'Email Address',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'email']),
          _isSortable: true,
          _isHidden: true
        },
        {
          _attrs: ['jobTitle'],
          _name: 'Job',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'job']),
          _isHidden: !this.canAccess(['tableColumns', 'job']),
        },
        {
          _attrs: ['company.name'],
          _name: 'Company',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'company']),
          _isHidden: !this.canAccess(['tableColumns', 'company']),
        },
        {
          _attrs: ['domain'],
          _name: 'Domain',
          _type: 'TEXT',
          _isSortable: true,
          _width: '200px',
          _isSearchable: this.canAccess(['searchBy', 'domain']),
          _isHidden: !this.canAccess(['tableColumns', 'domain']),
        },
        {
          _attrs: ['created'],
          _name: 'Created',
          _type: 'DATE',
          _isSortable: true,
          _width: '130px',
          _isHidden: !this.canAccess(['tableColumns', 'created'])
        }
      ]
    };
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['users'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['users']);
    }
  }

  public onClickEdit(value: User) {
    this._selectedUser = value;
    this._sidebarValue = {
      animate_state: 'active',
      type: 'editUser',
      title: this.canAccess(['user', 'edit']) ? 'Edit User' : 'View User'
    };
  }

  public updateUser(value: User) {
    if (this.canAccess(['user', 'edit'])) {
      this._userService.updateOther(value).pipe(first()).subscribe(() => {
        this._translateNotificationsService.success('Success', 'The user has been updated.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Error', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    } else {
      this._translateNotificationsService.error('Error', '403.PERMISSION_DENIED');
    }
  }

  public onClickDelete(users: Array<User>) {
    this._usersToRemove = [];
    users.forEach(value => this._usersToRemove.push(new User(value)));
    this._modalDelete = true;
  }

  public onClickConfirm() {
    for (const user of this._usersToRemove) {
      this._removeUser(user.id);
    }
    this._getUsers();
    this._usersToRemove = [];
    this._modalDelete = false;
  }

  private _removeUser(value: string) {
    this._userService.deleteUser(value).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Success', 'The user has been deleted.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Error', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public synchronizeSRTUsers() {
    this._userService.createSwellUsers().pipe(first()).subscribe(response => {
      this._translateNotificationsService.success('Success', 'All the users are updated.');
      this._getUsers();
      console.log(response);
    }, (err: HttpErrorResponse) => {
      console.error(err);
    });
  }

  // TODO
  inviteUser(event: Event): void {
    event.preventDefault();
  }

  set config(value: UmiusConfigInterface) {
    this._config = value;
    this._getUsers();
  }

  get config(): UmiusConfigInterface {
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

  set sidebarValue(value: UmiusSidebarInterface) {
    this._sidebarValue = value;
  }

  get sidebarValue(): UmiusSidebarInterface {
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

  get isJuan(): boolean {
    return this._isJuan;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }
}
