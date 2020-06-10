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
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../../services/user/user.service';
import { environment } from '../../../../../../environments/environment';
import { User } from '../../../../../models/user.model';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})

export class AdminProjectsComponent implements OnInit {

  private _projects: Array<any> = [];

  private _totalProjects = -1;

  private _table: Table = <Table>{};

  private _config: Config = {
    fields: 'name,innovationCards,owner,domain,updated,created,status,mission,operator',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _operators: Array<User>;

  private _isLoading = true;

  private _mainObjective = this._translateService.currentLang === 'en' ?
    'mission.objective.principal.en' : 'mission.objective.principal.fr';

  private _objectiveSearchKey = this._translateService.currentLang === 'en' ?
    'objective.principal.en' : 'objective.principal.fr';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService,
              private _userService: UserService) {

    this._translateTitleService.setTitle('Market Tests');

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._config.limit = this._configService.configLimit('admin-projects-limit');
      this._initializeTable();
      this._getOperators().then( _ => {
        this._getProjects();
      }, err => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status))
      });
    }
  }

  /***
   * this is to get the projects from the server.
   * @private
   */
  private _getProjects() {
    this._innovationService.getAll(this._config).pipe(first()).subscribe((innovations: Response) => {
      this._projects = innovations.result;
      this._initProjects();
      this._totalProjects = innovations._metadata.totalCount;
      this._initializeTable();
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status))
    });
  }

  /**
   * Get the list of all operators in the domain
   * @private
   */
  private _getOperators() {
    return new Promise( (resolve, reject) => {
      const operatorConfig = <Config>{
        fields: '',
        limit: '10',
        offset: '0',
        search: '{}',
        sort: '{"created":-1}',
        domain: environment.domain,
        isOperator: 'true'
      };
      this._userService.getAll(operatorConfig).pipe(first())
        .subscribe(operators => {
          this._operators = operators && operators['result'] ? operators['result'] : [];
          resolve(true);
        }, err => {
          reject(err);
        });
    });
  }

  /**
   * Sends a request to cross search innovations using external collections, e.g., innovations x missions or
   * innovations x innovation card title
   * @param config
   * @private
   */
  private _searchMissionsByOther(config: Config) {
    // Change here the fields. This will hit an aggregate on the back
    this._innovationService.advancedSearch(config)
      .subscribe(innovations => {
        this._projects = innovations.result;
        this._initProjects();
        this._totalProjects = innovations._metadata.totalCount;
        this._initializeTable();
      }, err => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status))
      });
  }

  private _initProjects() {
    this._projects = this._projects.map((project) => {
      if (project.innovationCards && project.innovationCards.length) {
        project.innovationCards = InnovationFrontService.currentLangInnovationCard(project, this._translateService.currentLang, 'card');
      }
      return project;
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
        {_attrs: ['name'], _name: 'Name', _type: 'TEXT', _isSortable: true, _isSearchable: true },
        {
          _attrs: ['innovationCards.title'],
          _name: 'Innovation card title',
          _type: 'TEXT',
          _isSearchable: true,
          _searchConfig: { _collection: 'innovationcard', _searchKey: 'title' }
        }, // Using _searchConfig for advanced search
        {_attrs: ['owner.firstName', 'owner.lastName'], _name: 'Owner', _type: 'TEXT', _width: '180px' },
        { _attrs: ['owner.company.name'],
          _name: 'Company',
          _type: 'TEXT',
          _width: '180px',
          _isSearchable: true,
          _searchConfig: {_collection: 'user', _searchKey: 'company.name' }
        },
        {
          _attrs: ['mission.type'],
          _name: 'Type',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: true,
          _width: '100px',
          _searchConfig: {_collection: 'mission', _searchKey: 'type' }
          }, // Using _searchConfig for advanced search
        {
          _attrs: [this._mainObjective],
          _name: 'Objective',
          _type: 'TEXT',
          _isSearchable: true,
          _width: '200px',
          _searchConfig: { _collection: 'mission', _searchKey: this._objectiveSearchKey }
          }, // Using _searchConfig for advanced search
        {_attrs: ['created'], _name: 'Created', _type: 'DATE', _isSortable: true, _width: '150px' },
        {_attrs: ['status'], _name: 'Status', _type: 'MULTI-CHOICES', _isSortable: true, _isSearchable: true, _width: '150px',
          _choices: [
            {_name: 'EDITING', _alias: 'Editing', _class: 'label is-secondary'},
            {_name: 'SUBMITTED', _alias: 'Submitted',  _class: 'label is-draft'},
            {_name: 'EVALUATING', _alias: 'Evaluating',  _class: 'label is-progress'},
            {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
          ]},
        {_attrs: ['operator'], _name: 'Operator', _type: 'MULTI-CHOICES', _isSearchable: true, _isHidden: true,
          _choices: this._operators && this._operators.length ? this._operators.map(oper => {
            return {_name: oper['_id'], _alias: `${oper.firstName} ${oper.lastName}`};
          }) : []
        },
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
    this._config = value; // TODO how to change the config when searching things like the operator?
    try {
      // Parse the config.search field to see if there's something
      if (this._config['fromCollection']) {
        this._searchMissionsByOther(this._config);
      } else {
        this._getProjects();
      }
    } catch (ex) {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(ex.message));
      this._getProjects();
    }
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
