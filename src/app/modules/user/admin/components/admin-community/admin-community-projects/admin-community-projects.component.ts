import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from "../../../../../../services/title/title.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from '../../../../../table/models/table';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-admin-community-projects',
  templateUrl: './admin-community-projects.component.html',
  styleUrls: ['./admin-community-projects.component.scss']
})

export class AdminCommunityProjectsComponent implements OnInit {

  private _tableInfos: Table = null;

  private _config: any = {
    fields: '',
    limit: '',
    offset: '0',
    search: '{}',
    status: "EVALUATING",
    sort: '{"created":-1}'
  };

  private _totalProjects: Array<any> = [];

  private _noResult: boolean;

  private _fetchingError: boolean;

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.PROJECTS');

    if (Array.isArray(this._activatedRoute.snapshot.data.projects)) {
      this._totalProjects = this._activatedRoute.snapshot.data.projects;
      this._noResult = this._totalProjects.length === 0;
      this._configureTable();
    } else {
      this._fetchingError = true;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    }

  }

  ngOnInit() {
  }


  private _configureTable() {
    this._tableInfos = {
      _selector: 'admin-community-projects',
      _title: 'TABLE.TITLE.PROJECTS',
      _content: this._totalProjects,
      _total: this._totalProjects.length,
      _isSearchable: true,
      _columns: [
        {
          _attrs: ['innovation.name'],
          _name: 'Projects',
          _type: 'TEXT'
        },
        {
          _attrs: ['innovation.created'],
          _name: 'Created on',
          _type: 'DATE'
        },
        {
          _attrs: ['nbAmbassadors', 'nbRecAmbassadors'],
          _name: 'Ambassador count / Suggested',
          _type: 'MULTI-LABEL',
          _isSortable: false,
          _multiLabels: [
            {_attr: 'nbAmbassadors', _class: 'label label-success' },
            {_attr: 'nbRecAmbassadors', _class: 'label label-draft'}
            ],
        },
        {
          _attrs: ['nbAnswers', 'nbAnswersFromAmbassadors'],
          _name: 'Feedback / From Ambassador',
          _type: 'MULTI-LABEL',
          _isSortable: false,
          _multiLabels: [
            {_attr: 'nbAnswers', _class: 'label label-success'},
            {_attr: 'nbAnswersFromAmbassadors', _class: 'label label-draft'}
            ],
        },
        {
          _attrs: ['innovation.status'],
          _name: 'Status',
          _type: 'MULTI-CHOICES',
          _isSortable: false,
          _choices: [
            {_name: 'EDITING', _alias: 'Editing', _class: 'label label-edit'},
            {_name: 'SUBMITTED', _alias: 'Submitted',  _class: 'label label-draft'},
            {_name: 'EVALUATING', _alias: 'Evaluating',  _class: 'label label-progress'},
            {_name: 'DONE', _alias: 'Done', _class: 'label label-success'},
          ]
        }
      ]
    };
  }


  public onClickShow(project: any) {
    this._router.navigate(['/user/admin/community/projects/' + project.innovation._id]);
  }

  get config() {
    return this._config;
  }

  get tableInfos() {
    return this._tableInfos;
  }

  get totalProjects(): Array<any> {
    return this._totalProjects;
  }

  get noResult(): boolean {
    return this._noResult;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

}
