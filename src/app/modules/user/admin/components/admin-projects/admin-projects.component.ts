import { Component } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../models/innovation';
import { Table } from '../../../../table/models/table';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Config } from '../../../../../models/config';
import { Response } from '../../../../../models/response';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})

export class AdminProjectsComponent {

  private _projects: Array<Innovation> = [];

  private _total: number;

  private _table: Table;

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _fetchingError: boolean;

  constructor(private _innovationService: InnovationService,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.PROJECTS');

    if (this._activatedRoute.snapshot.data.projects && Array.isArray(this._activatedRoute.snapshot.data.projects.result)) {
      this._projects = this._activatedRoute.snapshot.data.projects.result;
      this._total = this._activatedRoute.snapshot.data.projects._metadata.totalCount;
      this._initializeTable();
    } else {
      this._fetchingError = true;
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
        {_attrs: ['owner.firstName', 'owner.lastName'], _name: 'TABLE.HEADING.OWNER', _type: 'TEXT', _isSearchable: true },
        {_attrs: ['domain'], _name: 'TABLE.HEADING.DOMAIN', _type: 'TEXT', _isSortable: true, _isSearchable: true},
        {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isSortable: true },
        {_attrs: ['updated'], _name: 'TABLE.HEADING.UPDATED', _type: 'DATE', _isSortable: true },
        {_attrs: ['status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES', _isSortable: true, _isSearchable: true,
          _choices: [
            {_name: 'EDITING', _alias: 'Editing', _class: 'label label-edit'},
            {_name: 'SUBMITTED', _alias: 'Submitted',  _class: 'label label-draft'},
            {_name: 'EVALUATING', _alias: 'Evaluating',  _class: 'label label-progress'},
            {_name: 'DONE', _alias: 'Done', _class: 'label label-success'},
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
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }

  public navigate(value: Innovation) {
    this._router.navigate(['/user/admin/projects/project/' + value._id]);
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
