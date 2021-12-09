import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { Table, Config } from '@umius/umi-common-component/models';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ShieldService } from '../../../../../../services/shield/shield.service';

@Component({
  selector: 'app-admin-professional-shield',
  templateUrl: 'admin-professional-shield.component.html',
})
export class AdminProfessionalShieldComponent implements OnInit {

  private _config = <Config>{
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _table: Table;

  private _shieldPros: Array<any>;
  private _total: number;

  sidebarState = new Subject<string>();




  constructor(private _shieldService: ShieldService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._getShieldedPros();
  }

  private _initializeTable() {
    this._table = {
      _selector: 'admin-user-limit',
      _title: 'TABLE.TITLE.PROFESSIONALS',
      _content: this._shieldPros || [],
      _total: this._total || 0,
      _isSearchable: false,
      _isDeletable: false,
      _isSelectable: true,
      _isEditable: false,
      _isTitle: true,
      _isPaginable: true,
      _clickIndex: 1,
      _columns: [
        {_attrs: ['professional.firstName', 'professional.lastName'],
          _name: 'TABLE.HEADING.NAME', _type: 'TEXT', _isSearchable: false, _isSortable: true},
        {_attrs: ['email'], _name: 'TABLE.HEADING.EMAIL_ADDRESS', _type: 'TEXT', _isSearchable: true, _isSortable: true},
        {_attrs: ['professional.company'], _name: 'TABLE.HEADING.COMPANY', _type: 'TEXT', _isSearchable: false, _isSortable: true},
        {_attrs: ['createdAt-90'], _name: 'TABLE.HEADING.TTR', _type: 'DAYS-TO', _isSearchable: false, _isSortable: false},
        {_attrs: ['professional.ambassador.is'], _name: 'TABLE.HEADING.AMBASSADOR', _type: 'TEXT', _isSearchable: false, _isSortable: false}
      ]
    };
  }

  private _getShieldedPros() {
    this._shieldService.get(null, this._config)
      .pipe(first())
      .subscribe( response => {
        this._shieldPros = response.result;
        this._total = response._metadata.totalCount;
        this._initializeTable();
      }, err => {
        this._notificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
      });
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    this._getShieldedPros();
  }

  get tableInfos(): any {
    return this._table;
  }

}
