import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../models/innovation';
import { Table } from '../../../../table/models/table';
import { first } from 'rxjs/operators';
import { Config } from '../../../../../models/config';
import { Response } from '../../../../../models/response';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { ConfigService } from '../../../../../services/config/config.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})

export class AdminProjectsComponent implements OnInit {

  private _projects: Array<Innovation> = [];

  private _total: number = -1;

  private _table: Table;

  private _config: Config = {
    fields: 'name,innovationCards,owner,domain,updated,created,status',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _fetchingError: boolean;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.PROJECTS');

  }

  ngOnInit(): void {

    if (isPlatformBrowser(this._platformId)) {

      this._config.limit = this._configService.configLimit('admin-projects-limit');

      this._innovationService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
        this._projects = response.result;
        this._total = response._metadata.totalCount;
        this._initializeTable();
      }, () => {
        this._fetchingError = true;
      });

    }

  }

  private _initializeTable() {
    this._table = {
      _selector: 'admin-projects-limit',
      _title: 'TABLE.TITLE.PROJECTS',
      _content: this._projects,
      _total: this._total,
      _isSearchable: true,
      _isEditable: false,
      _isTitle: true,
      _editIndex: 1,
      _isPaginable: true,
      _columns: [
        {_attrs: ['name'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT', _isSortable: true, _isSearchable: true },
        {_attrs: ['innovationCards.title'], _name: 'TABLE.HEADING.TITLE', _type: 'TEXT', _isSortable: true, _isSearchable: true },
        {_attrs: ['owner.firstName', 'owner.lastName'], _name: 'TABLE.HEADING.OWNER', _type: 'TEXT' },
        {_attrs: ['domain'], _name: 'TABLE.HEADING.DOMAIN', _type: 'TEXT', _isSortable: true, _isSearchable: true},
        {_attrs: ['updated'], _name: 'TABLE.HEADING.UPDATED', _type: 'DATE', _isSortable: true },
        {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isSortable: true },
        {_attrs: ['status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES', _isSortable: true, _isSearchable: true,
          _choices: [
            {_name: 'EDITING', _alias: 'Editing', _class: 'label is-secondary'},
            {_name: 'SUBMITTED', _alias: 'Submitted',  _class: 'label is-draft'},
            {_name: 'EVALUATING', _alias: 'Evaluating',  _class: 'label is-progress'},
            {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
          ]}
      ]
    };
  }

  private _getProjects() {
    this._innovationService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._projects = response.result;
      this._total = response._metadata.totalCount;
      this._initializeTable();
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }

  public navigate(value: Innovation) {
    window.open(`/user/admin/projects/project/${value._id}`, '_blank');
  }

  public onClickImport(file: File) {
    this._innovationService.import(file).pipe(first()).subscribe(() => {
      this._getProjects();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.IMPORT.CSV');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  set config(value: Config) {
    this._config = value;
    this._getProjects();
  }

  get config(): Config {
    return this._config;
  }

  get total(): number {
    return this._total;
  }

  get projects(): Array<Innovation> {
    return this._projects;
  }

  get table(): Table {
    return this._table;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

}
