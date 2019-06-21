import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../../services/user/user.service';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { User } from '../../../../../models/user.model';
import { Table } from '../../../../table/models/table';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { SidebarInterface } from '../../../../sidebar/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';
import {Config} from '../../../../../models/config';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})

export class AdminUsersComponent implements OnInit {

  private _users: Array<User> = [];

  private _usersToRemove: User[] = [];

  private _sidebarValue: SidebarInterface = {};

  private _tableInfos: Table;

  private _modalDelete = false;

  private _currentUser: User;

  private _total: number;

  private _me: boolean = false;

  private _config: Config = {
    fields: 'id company jobTitle created domain location firstName lastName',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  constructor(private translateTitleService: TranslateTitleService,
              private userService: UserService,
              private translateNotificationsService: TranslateNotificationsService) {

    this.translateTitleService.setTitle('USERS.TITLE');

  }

  ngOnInit() {
    this.loadUsers();
  }


  private loadUsers(): void {
    this.userService.getAll(this._config).pipe(first()).subscribe((users: any) => {
      this._users = users.result;
      this._total = users._metadata.totalCount;

      this._tableInfos = {
        _selector: 'admin-user',
        _title: 'TABLE.TITLE.USERS',
        _content: this._users,
        _total: this._total,
        _isSearchable: true,
        _isDeletable: true,
        _isSelectable: true,
        _isEditable: true,
        _isTitle: true,
        _isPaginable: true,
        _editIndex: 1,
        _columns: [
          {_attrs: ['firstName', 'lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT', _isSearchable: true, _isSortable: true},
          {_attrs: ['jobTitle'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT', _isSortable: true, _isSearchable: true},
          {_attrs: ['company.name'], _name: 'TABLE.HEADING.COMPANY', _type: 'TEXT', _isSortable: true, _isSearchable: true},
          {_attrs: ['domain'], _name: 'TABLE.HEADING.DOMAIN', _type: 'TEXT', _isSortable: true, _isSearchable: true},
          {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isSortable: true}
          ]
      };
      }, () => {
      this.translateNotificationsService.error('ERROR', 'ERROR.FETCHING_ERROR')
    });
    this.userService.getSelf().pipe(first())
      .subscribe(result => {
        this._me = result && result.email === 'jdcruz-gomez@umi.us';
      }, err => {
        console.error(err);
      });
  }

  inviteUser(event: Event): void {
    event.preventDefault();
    // TODO
  }


  editUser(user: User) {
    const us = new User(user);

    this.userService.get(us.id).pipe(first()).subscribe((value: any) => {
      this._sidebarValue = {
        animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
        title: 'SIDEBAR.TITLE.EDIT_USER',
        type: 'editUser'
      };
      this._currentUser = value;
    });

  }


  updateUser(user: User) {
    this.userService.updateOther(user).pipe(first()).subscribe((data: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_UPDATE_TEXT');
      this.loadUsers();
    },
    () => {
      this.translateNotificationsService.error('ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  deleteUsersModal(users: User[]) {
    this._usersToRemove = [];
    this._modalDelete = true;
    users.forEach(value => this._usersToRemove.push(new User(value)));
  }


  onClickSubmit() {
    for (const user of this._usersToRemove) {
      this.removeUser(user.id);
    }
    this._usersToRemove = [];
    this._modalDelete = false;
  }


  private removeUser(userId: string) {
    this.userService.deleteUser(userId).pipe(first()).subscribe((foo: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_DELETE_TEXT');
      this.loadUsers();
    }, () => {
      this.translateNotificationsService.error('ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  public synchronizeSRTUsers() {
    this.userService.createSwellUsers().pipe(first())
      .subscribe(result => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_UPDATE_TEXT');
        console.log(result);
      }, err => {
        console.error(err);
      });
  }

  public isJuan(): boolean {
    return this._me;
  }

  set config(value: Config) {
    this._config = value;
    this.loadUsers();
  }

  get config(): Config {
    return this._config;
  }

  get tableInfos(): Table {
    return this._tableInfos;
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

  get currentUser(): User {
    return this._currentUser;
  }

  get modalDelete(): boolean {
    return this._modalDelete;
  }

  set modalDelete(value: boolean) {
    this._modalDelete = value;
  }

}
