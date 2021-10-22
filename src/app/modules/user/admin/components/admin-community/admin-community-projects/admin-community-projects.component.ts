import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { Table, Config } from '@umius/umi-common-component/models';
import { isPlatformBrowser } from '@angular/common';
import { first} from 'rxjs/operators';
import { AdvSearchService } from '../../../../../../services/advsearch/advsearch.service';
import { Router } from '@angular/router';

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
    status: 'EVALUATING',
    sort: '{ "created": -1 }'
  };

  private _total = -1;

  private _table: Table;

  private _projects: Array<any> = [];

  private _fetchingError: boolean;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _router: Router,
              private _advSearchService: AdvSearchService,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.COMMUNITY_PROJECTS');
  }

  ngOnInit() {

    if (isPlatformBrowser(this._platformId)) {
      this._advSearchService.getCommunityInnovations(this._config).pipe(first()).subscribe((response: Array<any>) => {
        this._projects = response;
        this._total = this._projects.length;
        this._initializeTable();
      }, () => {
        this._fetchingError = true;
      });
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
      _clickIndex: 1,
      _isLocal: true,
      _isPaginable: true,
      _columns: [
        {_attrs: ['innovation.name'], _name: 'TABLE.HEADING.PROJECTS', _type: 'TEXT'},
        {_attrs: ['nbAmbassadors', 'nbRecAmbassadors'], _name: 'Ambassador count / Suggested', _type: 'MULTI-LABEL',
          _multiLabels: [
            {_attr: 'nbAmbassadors', _class: 'label is-success' },
            {_attr: 'nbRecAmbassadors', _class: 'label is-draft'}
          ],
        },
        {_attrs: ['nbAnswers', 'nbAnswersFromAmbassadors'], _name: 'Feedback / From Ambassador', _type: 'MULTI-LABEL',
          _multiLabels: [
            {_attr: 'nbAnswers', _class: 'label is-success'},
            {_attr: 'nbAnswersFromAmbassadors', _class: 'label is-draft'}
            ],
        },
        {_attrs: ['innovation.created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE'},
        {_attrs: ['innovation.status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES', _isSearchable: true,
          _choices: [
            {_name: 'EDITING', _alias: 'Editing', _class: 'label is-secondary'},
            {_name: 'SUBMITTED', _alias: 'Submitted',  _class: 'label is-draft'},
            {_name: 'EVALUATING', _alias: 'Evaluating',  _class: 'label is-progress'},
            {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
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
