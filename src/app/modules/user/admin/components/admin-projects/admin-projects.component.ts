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
import { RolesFrontService } from "../../../../../services/roles/roles-front.service";

@Component({
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})

export class AdminProjectsComponent implements OnInit {

  private _projects: Array<any> = [];

  private _totalProjects = -1;

  private _table: Table = <Table>{};

  private _config: Config = {
    fields: 'name,innovationCards,owner,domain,updated,created,status,mission,operator',
    limit: this._configService.configLimit('admin-projects-limit'),
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _operators: Array<User> = [];

  private _isLoading = true;

  private _currentLang = this._translateService.currentLang;

  private _mainObjective = this._currentLang === 'en' ?
    'mission.objective.principal.en' : 'mission.objective.principal.fr';

  private _objectiveSearchKey = this._currentLang === 'en' ?
    'objective.principal.en' : 'objective.principal.fr';

  private _fetchingError = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _rolesFrontService: RolesFrontService,
              private _translateTitleService: TranslateTitleService,
              private _userService: UserService) {

    this._translateTitleService.setTitle('Market Tests');

  }

  ngOnInit(): void {
    this._initializeTable();

    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._getOperators().then( _ => {
        this._getProjects();
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isLoading = false;
        this._fetchingError = true;
        console.error(err);
      });
    }

  }

  /***
   * this is to get the projects from the server.
   * @private
   */
  private _getProjects() {
    this._innovationService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._projects = response && response.result;
      this._initProjects();
      this._totalProjects = response && response._metadata && response._metadata.totalCount;
      this._initializeTable();
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      this._isLoading = false;
      this._fetchingError = true;
      console.error(err);
    });
  }

  /**
   * Get the list of all operators in the domain
   * @private
   */
  private _getOperators() {
    return new Promise( (resolve, reject) => {
      const operatorConfig = <Config>{
        fields: 'firstName,lastName',
        limit: '20',
        offset: '0',
        search: '{}',
        sort: '{"created":-1}',
        domain: environment.domain,
        $or: JSON.stringify([{roles: 'market-test-manager-umi'}, {roles: 'oper-supervisor'}])
      };
      this._userService.getAll(operatorConfig).pipe(first()).subscribe(operators => {
        this._operators = operators && operators['result'] ? operators['result'] : [];
        resolve(true);
        }, (err: HttpErrorResponse) => {
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
    /* Warning: Juan is experimenting with this encoding. The idea is to encode the query params (not a crypto thing)
     * to avoid send thing in clear text. The endpoint in the back is prepared to parse this*/
    this._innovationService.advancedSearch({
      config: encodeURI(Buffer.from(JSON.stringify(config)).toString('base64'))
    }).pipe(first()).subscribe(innovations => {
      this._projects = innovations.result;
      this._initProjects();
      this._totalProjects = innovations._metadata.totalCount;
      this._initializeTable();
    }, err => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  private _initProjects() {
    this._projects = this._projects.map((project) => {
      if (project.innovationCards && project.innovationCards.length) {
        project.innovationCards =
          InnovationFrontService.currentLangInnovationCard(project, this._currentLang, 'CARD');
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
      _title: 'projects',
      _content: this._projects,
      _total: this._totalProjects,
      _isSearchable: !!this.canAccess(['searchBy']) || !!this.canAccess(['filterBy']),
      _isTitle: true,
      _clickIndex: this.canAccess(['project', 'tabs']) ? 1 : null,
      _isPaginable: true,
      _columns: [
        {
          _attrs: ['name'],
          _name: 'Name',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'name']),
          _isHidden: !this.canAccess(['tableColumns', 'name'])
        },
        {
          _attrs: ['innovationCards.title'],
          _name: 'Innovation Card Title',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'innovationCard']),
          _isHidden: !this.canAccess(['tableColumns', 'innovationCard']),
          _searchConfig: { _collection: 'innovationcard', _searchKey: 'title' }
        }, // Using _searchConfig for advanced search
        {
          _attrs: ['owner.firstName', 'owner.lastName'],
          _name: 'Owner',
          _type: 'TEXT',
          _width: '180px',
          _isHidden: !this.canAccess(['tableColumns', 'owner'])
        },
        { _attrs: ['owner.company.name'],
          _name: 'Company',
          _type: 'TEXT',
          _width: '180px',
          _isSearchable: this.canAccess(['searchBy', 'company']),
          _isHidden: !this.canAccess(['tableColumns', 'company']),
          _searchConfig: {_collection: 'user', _searchKey: 'company.name' }
        },
        {
          _attrs: ['mission.type'],
          _name: 'Type',
          _type: 'TEXT',
          _isSortable: true,
          _isSearchable: this.canAccess(['searchBy', 'type']),
          _isHidden: !this.canAccess(['tableColumns', 'type']),
          _width: '100px',
          _searchConfig: {_collection: 'mission', _searchKey: 'type' }
          }, // Using _searchConfig for advanced search
        {
          _attrs: [this._mainObjective],
          _name: 'Objective',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'objective']),
          _isHidden: !this.canAccess(['tableColumns', 'objective']),
          _width: '200px',
          _searchConfig: { _collection: 'mission', _searchKey: this._objectiveSearchKey }
          }, // Using _searchConfig for advanced search
        {
          _attrs: ['updated'],
          _name: 'Last Updated',
          _type: 'DATE_TIME',
          _isSortable: true,
          _width: '200px',
          _isHidden: !this.canAccess(['tableColumns', 'lastUpdated'])
        },
        {
          _attrs: ['created'],
          _name: 'Created',
          _type: 'DATE',
          _isSortable: true,
          _width: '130px',
          _isHidden: !this.canAccess(['tableColumns', 'created'])
        },
        {
          _attrs: ['status'],
          _name: 'Status',
          _type: 'MULTI-CHOICES',
          _isSortable: true,
          _isSearchable: this.canAccess(['filterBy', 'status']),
          _isHidden: !this.canAccess(['tableColumns', 'status']),
          _width: '150px',
          _choices: [
            {_name: 'EDITING', _alias: 'Editing', _class: 'label is-secondary'},
            {_name: 'SUBMITTED', _alias: 'Submitted',  _class: 'label is-draft'},
            {_name: 'EVALUATING', _alias: 'Evaluating',  _class: 'label is-progress'},
            {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
          ]},
        {
          _attrs: ['operator'],
          _name: 'Operator',
          _type: 'MULTI-CHOICES',
          _isSearchable: this.canAccess(['filterBy', 'operator']),
          _isHidden: true,
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
    window.open(`/user/admin/projects/project/${innovation._id}/${this._rolesFrontService.projectDefaultRoute()}`, '_blank');
  }

  /***
   * when the user clicks the Import button to import the projects.
   * @param file
   */
  public onClickImport(file: File) {
    this._innovationService.import(file).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Success', 'The project is imported.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['projects'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['projects']);
    }
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
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(ex.status));
      this._getProjects();
      console.error(ex);
    }
  }

  get canImport(): boolean {
    return this._rolesFrontService.isTechRole() || this._rolesFrontService.isOperSupervisorRole();
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

  get fetchingError(): boolean {
    return this._fetchingError;
  }

}
