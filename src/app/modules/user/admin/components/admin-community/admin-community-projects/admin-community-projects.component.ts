import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from "../../../../../../services/title/title.service";
import { first } from "rxjs/operators";
import { AdvSearchService } from "../../../../../../services/advsearch/advsearch.service";
import { Router } from "@angular/router";
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-admin-community-projects',
  templateUrl: './admin-community-projects.component.html',
  styleUrls: ['./admin-community-projects.component.scss']
})

export class AdminCommunityProjectsComponent implements OnInit {

  private _tableInfos: any = null;

  private _config: any;

  private _noResult = false;

  constructor(private _advSearch: AdvSearchService,
              private _router: Router,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.PROJECTS');

    this._setConfig();

    this._configureTable();

  }

  ngOnInit() {
    this._getAllProjects();
  }


  private _setConfig() {
    this._config = {
      fields: '',
      limit: '10',
      offset: '0',
      search: '{}',
      status: "EVALUATING",
      sort: '{"created":-1}'
    };
  }


  private _configureTable() {
    this._tableInfos = {
      _selector: 'admin-community-projects',
      _title: 'TABLE.TITLE.PROJECTS',
      _content: [],
      _total: 0,
      _isHeadable: true,
      _isFiltrable: true,
      _isShowable: true,
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


  private _getAllProjects() {
    this._advSearch.getCommunityInnovations(this._config).pipe(first()).subscribe((response) => {
      this._setTableContent(response, response.length);
      this._noResult = response.length === 0;
      }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  private _setTableContent(projects: Array<any>, total: number) {
    const tableInfos = this._tableInfos;
    tableInfos._content = projects;
    tableInfos._total = total;
    this._tableInfos = JSON.parse(JSON.stringify(tableInfos));
  }


  public configChanges(config: any) {
    this._config = config;
    this._getAllProjects();
  }


  public onClickShow(project: any) {
    this._router.navigate(['/user/admin/community/projects/project/' + project.innovation._id]);
  }

  get config() {
    return this._config;
  }

  get tableInfos() {
    return this._tableInfos;
  }

  get noResult(): boolean {
    return this._noResult;
  }

}
