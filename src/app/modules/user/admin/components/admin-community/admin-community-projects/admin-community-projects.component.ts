import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from "../../../../../../services/title/title.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from '../../../../../table/models/table';
import { Config } from '../../../../../../models/config';

@Component({
  selector: 'app-admin-community-projects',
  templateUrl: './admin-community-projects.component.html',
  styleUrls: ['./admin-community-projects.component.scss']
})

export class AdminCommunityProjectsComponent implements OnInit {

  private _config: Config = {
    fields: '',
    limit: '',
    offset: '0',
    search: '{}',
    status: "EVALUATING",
    sort: '{ "created": -1 }'
  };

  private _total: number;

  private _table: Table;

  private _projects: Array<any> = [];

  private _fetchingError: boolean;

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.COMMUNITY_PROJECTS');
  }

  ngOnInit() {

    if (this._activatedRoute.snapshot.data.projects && Array.isArray(this._activatedRoute.snapshot.data.projects)) {
      this._projects = this._activatedRoute.snapshot.data.projects;
      this._total = this._projects.length;
      this._initializeTable();
    } else {
      this._fetchingError = true;
    }

  }


  private _initializeTable() {
    this._table = {
      _selector: 'admin-community-projects',
      _title: 'TABLE.TITLE.PROJECTS',
      _content: this._projects,
      _total: this._total,
      _isSearchable: true,
      _isTitle: true,
      _editIndex: 1,
      _isLocal: true,
      _isPaginable: true,
      _columns: [
        {_attrs: ['innovation.name'], _name: 'TABLE.HEADING.PROJECTS', _type: 'TEXT'},
        {_attrs: ['nbAmbassadors', 'nbRecAmbassadors'], _name: 'Ambassador count / Suggested', _type: 'MULTI-LABEL',
          _multiLabels: [
            {_attr: 'nbAmbassadors', _class: 'label label-success' },
            {_attr: 'nbRecAmbassadors', _class: 'label label-draft'}
          ],
        },
        {_attrs: ['nbAnswers', 'nbAnswersFromAmbassadors'], _name: 'Feedback / From Ambassador', _type: 'MULTI-LABEL',
          _multiLabels: [
            {_attr: 'nbAnswers', _class: 'label label-success'},
            {_attr: 'nbAnswersFromAmbassadors', _class: 'label label-draft'}
            ],
        },
        {_attrs: ['innovation.created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE'},
        {_attrs: ['innovation.status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES', _isSearchable: true,
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

  get config(): Config {
    return this._config;
  }

  get table(): Table {
    return this._table;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get total(): number {
    return this._total;
  }

}
