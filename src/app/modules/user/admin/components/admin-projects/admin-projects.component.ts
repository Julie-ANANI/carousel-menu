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
import { TranslateService } from '@ngx-translate/core';
import { ErrorFrontService } from '../../../../../services/error/error-front';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})

export class AdminProjectsComponent implements OnInit {

  private _projects: Array<Innovation> = [];

  private _totalProjects = -1;

  private _table: Table = <Table>{};

  private _config: Config = {
    fields: 'name,innovationCards,owner,domain,updated,created,status,mission',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _isLoading = true;

  private _mainObjective = this._translateService.currentLang === 'en' ? 'mission.objective.principal.en' : 'mission.objective.principal.fr';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('Market Tests');

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._config.limit = this._configService.configLimit('admin-projects-limit');
      this._initializeTable();
      this._getProjects();
    }
  }

  /***
   * this is to get the projects from the server.
   * @private
   */
  private _getProjects() {
    this._innovationService.getAll(this._config).pipe(first()).subscribe((innovations: Response) => {
      this._projects = innovations.result;
      this._totalProjects = innovations._metadata.totalCount;
      this._initializeTable();
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status))
    });
  }

  /***
   * initializing the table with the projects.
   * @private
   */
  private _initializeTable() {
    this._table = {
      _selector: 'admin-projects-limit',
      _title: 'TABLE.TITLE.PROJECTS',
      _content: this._projects,
      _total: this._totalProjects,
      _isSearchable: true,
      _isEditable: false,
      _isTitle: true,
      _clickIndex: 1,
      _isPaginable: true,
      _columns: [
        {_attrs: ['name'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT', _isSortable: true, _isSearchable: true },
        {_attrs: ['owner.firstName', 'owner.lastName'], _name: 'TABLE.HEADING.OWNER', _type: 'TEXT' },
        {_attrs: ['mission.type'], _name: 'TABLE.HEADING.TYPE', _type: 'TEXT', _isSortable: true, _isSearchable: true, _width: '150px'},
        {_attrs: [this._mainObjective], _name: 'TABLE.HEADING.OBJECTIVE', _type: 'TEXT'},
        {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isSortable: true, _width: '150px' },
        {_attrs: ['status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES', _isSortable: true, _isSearchable: true, _width: '150px',
          _choices: [
            {_name: 'EDITING', _alias: 'Editing', _class: 'label is-secondary'},
            {_name: 'SUBMITTED', _alias: 'Submitted',  _class: 'label is-draft'},
            {_name: 'EVALUATING', _alias: 'Evaluating',  _class: 'label is-progress'},
            {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
          ]}
      ]
    };
  }

  /***
   * when the user clicks the Name opens the project in the new tab.
   * @param innovation
   */
  public navigate(innovation: Innovation) {
    window.open(`/user/admin/projects/project/${innovation._id}`, '_blank');
  }

  /***
   * when the user clicks the Import button to import the projects.
   * @param file
   */
  public onClickImport(file: File) {
    this._innovationService.import(file).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.IMPORT.CSV');
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
  }

  set config(value: Config) {
    this._config = value;
    this._getProjects();
  }

  get config(): Config {
    return this._config;
  }

  get projects(): Array<Innovation> {
    return this._projects;
  }

  get table(): Table {
    return this._table;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

}
