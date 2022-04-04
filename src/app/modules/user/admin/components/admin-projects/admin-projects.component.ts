import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../models/innovation';
import { first } from 'rxjs/operators';
import { Response } from '../../../../../models/response';
import { TranslateNotificationsService } from '../../../../../services/translate-notifications/translate-notifications.service';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../../../services/user/user.service';
import { environment } from '../../../../../../environments/environment';
import { User } from '../../../../../models/user.model';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { RolesFrontService } from '../../../../../services/roles/roles-front.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { ObjectivesPrincipal } from '../../../../../models/static-data/missionObjectives';
import { MissionTemplate } from '../../../../../models/mission';
import { MissionService } from '../../../../../services/mission/mission.service';
import { MissionFrontService } from '../../../../../services/mission/mission-front.service';
import {
  Column,
  Table,
  UmiusConfigInterface,
  UmiusConfigService,
  UmiusLocalStorageService
} from '@umius/umi-common-component';

@Component({
  templateUrl: './admin-projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdminProjectsComponent implements OnInit {

  private _projects: Array<any> = [];

  private _totalProjects = -1;

  private _table: Table = <Table>{};

  private _config: UmiusConfigInterface = {
    fields: '',
    limit: this._configService.configLimit('admin-projects-limit'),
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _operators: Array<User> = [];

  private _isLoading = true;

  private _currentLang = this._translateService.currentLang;

  private _objectiveSearchKey = this._currentLang === 'en' ? 'objective.en' : 'objective.fr';

  private _useCaseSearchKey = this._currentLang === 'en' ? 'useCase.en' : 'useCase.fr';

  private _fetchingError = false;

  private _missionTemplates: Array<MissionTemplate> = [];

  private _showModalDone = false;

  private _selectedInnovationId = '';

  /**
   * temporary solution until we change the functionality of table
   */
  private _initialProjects: Array<Innovation> = [];

  private _canImport = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: UmiusConfigService,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _rolesFrontService: RolesFrontService,
              private _authService: AuthService,
              private _translateTitleService: TranslateTitleService,
              private _missionService: MissionService,
              private _changeDetectorRef: ChangeDetectorRef,
              private _localStorageService: UmiusLocalStorageService,
              private _userService: UserService) {
    this._translateTitleService.setTitle('Market Tests');
  }

  ngOnInit(): void {
    this._initializeTable();

    if (isPlatformBrowser(this._platformId)) {
      this._getMissionTemplates();
      this._isLoading = false;
      this._setConfigForUmiBack();

      this._getOperators().then(_ => {
        if (this._rolesFrontService.isMTMUMIRole()) {
          this._configOperator();
        }
        this._getProjects();
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('Operators Fetching Error...', ErrorFrontService.getErrorKey(err.error));
        this._isLoading = false;
        this._fetchingError = true;
        console.error(err);
      });

      this._canImport = this._rolesFrontService.isTechRole() || this._rolesFrontService.isOperSupervisorRole()
        || this.canAccess(['import']);
    }

  }

  private _getMissionTemplates() {
    const templates = this._localStorageService.getItem('missionTemplates');
    if (templates) {
      this._missionTemplates = JSON.parse(templates).result || [];
    } else {
      this._missionService.getAllTemplates().pipe(first()).subscribe((response) => {
        this._missionTemplates = response && response.result || [];
        this._localStorageService.setItem('missionTemplates', JSON.stringify(response));
      }, error => {
        console.error(error);
      });
    }
  }

  /**
   * Only for MTM UMI Role
   * Different column order
   * @private
   */
  private _setColumnOrderForUser(): Array<Column> {
    switch (this._authService.user.roles) {
      case 'market-test-manager-umi':
        return [
          {
            _attrs: ['name'],
            _name: 'Name',
            _type: 'TEXT',
            _isSortable: true,
            _isSearchable: this.canAccess(['searchBy', 'name']),
            _isHidden: !this.canAccess(['tableColumns', 'name'])
          },
          {
            _attrs: ['company'],
            _name: 'Company',
            _type: 'TEXT',
            _width: '180px',
            _isSearchable: this.canAccess(['searchBy', 'company']),
            _isHidden: !this.canAccess(['tableColumns', 'company']),
          },
          {
            _attrs: ['status'],
            _name: 'Status',
            _type: 'MULTI-CHOICES',
            _isSortable: true,
            _isSearchable: this.canAccess(['filterBy', 'status']),
            _isHidden: !this.canAccess(['tableColumns', 'status']),
            _width: '200px',
            _choices: [
              {_name: 'EDITING', _alias: 'Editing', _class: 'label is-primary'},
              {_name: 'SUBMITTED', _alias: 'Submitted', _class: 'label is-draft'},
              {_name: 'EVALUATING', _alias: 'Evaluating', _class: 'label is-progress'},
              {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
            ],
            _isEditable: this.canAccess(['canEdit', 'status']),
            _editType: 'MULTI-CHOICES'
          },
          {
            _attrs: ['mainObjective'],
            _name: 'Objective',
            _type: 'TEXT',
            _isHidden: !this.canAccess(['tableColumns', 'objective']),
            _width: '200px'
          },
          {
            _attrs: ['emailSent'],
            _name: 'Email sent',
            _type: 'MULTI-CHOICES',
            _width: '150px',
            _isHidden: !this.canAccess(['tableColumns', 'emailSent']),
            _choices: [
              {_name: 'Yes', _alias: 'Yes', _class: 'label is-success'},
              {_name: 'No', _alias: 'No', _class: 'label is-danger'},
            ]
          },
          {
            _attrs: ['validatedAnswers'],
            _name: 'Validated Answers',
            _type: 'NUMBER',
            _width: '170px',
            _isHidden: !this.canAccess(['tableColumns', 'validatedAnswers'])
          },
          {
            _attrs: ['owner.firstName', 'owner.lastName'],
            _name: 'Owner',
            _type: 'TEXT',
            _width: '230px',
            _isHidden: !this.canAccess(['tableColumns', 'owner']),
            _isEditable: this.canAccess(['canEdit', 'owner']),
            _editType: 'USER-INPUT'
          },
          {
            _attrs: ['innovationCards.title'],
            _name: 'Innovation Card Title',
            _type: 'TEXT',
            _isSearchable: this.canAccess(['searchBy', 'innovationCard']),
            _isHidden: !this.canAccess(['tableColumns', 'innovationCard']),
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
            _attrs: ['mission.type'],
            _name: 'Type',
            _type: 'TEXT',
            _isSortable: true,
            _isHidden: !this.canAccess(['tableColumns', 'type']),
            _width: '200px',
            _isEditable: true,
            _editType: 'MULTI-CHOICES',
            _choices: [
              {_name: 'USER', _alias: 'User'},
              {_name: 'CLIENT', _alias: 'Client'},
              {_name: 'DEMO', _alias: 'Demo'},
              {_name: 'TEST', _alias: 'Test'},
            ]
          },
          {
            _attrs: [this._useCaseSearchKey],
            _name: 'Use case',
            _type: 'MULTI-CHOICES',
            _isSearchable: this.canAccess(['filterBy', 'objective']),
            _isHidden: true,
            _choices: this._missionTemplates.map((_template) => {
              const label = MissionFrontService.objectiveName(_template, this._currentLang);
              return {_name: label, _alias: label};
            })
          },
          {
            _attrs: [this._objectiveSearchKey],
            _name: 'Objective',
            _type: 'MULTI-CHOICES',
            _isSearchable: this.canAccess(['filterBy', 'objective']),
            _isHidden: true,
            _choices: ObjectivesPrincipal.map((objective) => {
              return {_name: objective[this._currentLang].label, _alias: objective[this._currentLang].label};
            })
          },
          {
            _attrs: ['operator'],
            _name: 'Operator',
            _type: 'MULTI-CHOICES',
            _isSearchable: this.canAccess(['filterBy', 'operator']),
            _isHidden: true,
            _choices: this._operators && this._operators.length ? this._operators.map(oper => {
              return {_name: `${oper.firstName} ${oper.lastName}`, _alias: `${oper.firstName} ${oper.lastName}`};
            }) : []
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
            _attrs: ['mission.type'],
            _name: 'Type',
            _type: 'MULTI-CHOICES',
            _isHidden: true,
            _isSearchable: this.canAccess(['filterBy', 'type']),
            _choices: [
              {_name: 'USER', _alias: 'User'},
              {_name: 'CLIENT', _alias: 'Client'},
              {_name: 'DEMO', _alias: 'Demo'},
              {_name: 'TEST', _alias: 'Test'},
            ]
          },
        ];
      case 'market-test-manager-umi-back':
        return [
          {
            _attrs: ['name'],
            _name: 'Name',
            _type: 'TEXT',
            _isSortable: true,
            _isSearchable: this.canAccess(['searchBy', 'name']),
            _isHidden: !this.canAccess(['tableColumns', 'name'])
          },
          {
            _attrs: ['company'],
            _name: 'Company',
            _type: 'TEXT',
            _width: '180px',
            _isSearchable: this.canAccess(['searchBy', 'company']),
            _isHidden: !this.canAccess(['tableColumns', 'company']),
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
              {_name: 'EDITING', _alias: 'Editing', _class: 'label is-primary'},
              {_name: 'SUBMITTED', _alias: 'Submitted', _class: 'label is-draft'},
              {_name: 'EVALUATING', _alias: 'Evaluating', _class: 'label is-progress'},
              {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
            ],
          },
          {
            _attrs: ['emailSent'],
            _name: 'Email sent',
            _type: 'MULTI-CHOICES',
            _width: '150px',
            _isHidden: !this.canAccess(['tableColumns', 'emailSent']),
            _choices: [
              {_name: 'Yes', _alias: 'Yes', _class: 'label is-success'},
              {_name: 'No', _alias: 'No', _class: 'label is-danger'},
            ]
          },
          {
            _attrs: ['emailsOK'],
            _name: 'Good Emails',
            _type: 'NUMBER',
            _isSortable: true,
            _isHidden: !this.canAccess(['tableColumns', 'goodEmails']),
          },
          {
            _attrs: ['validatedAnswers'],
            _name: 'Validated Answers',
            _type: 'NUMBER',
            _width: '170px',
            _isHidden: !this.canAccess(['tableColumns', 'validatedAnswers'])
          },
          {
            _attrs: ['mission.type'],
            _name: 'Type',
            _type: 'TEXT',
            _isSortable: true,
            _isHidden: !this.canAccess(['tableColumns', 'type']),
            _width: '200px',
            _isEditable: true,
            _editType: 'MULTI-CHOICES',
            _choices: [
              {_name: 'USER', _alias: 'User'},
              {_name: 'CLIENT', _alias: 'Client'},
              {_name: 'DEMO', _alias: 'Demo'},
              {_name: 'TEST', _alias: 'Test'},
            ]
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
            _attrs: ['innovationCards.title'],
            _name: 'Innovation Card Title',
            _type: 'TEXT',
            _isSearchable: this.canAccess(['searchBy', 'innovationCard']),
            _isHidden: !this.canAccess(['tableColumns', 'innovationCard']),
          },
          {
            _attrs: ['operator'],
            _name: 'Operator',
            _type: 'MULTI-CHOICES',
            _isSearchable: this.canAccess(['filterBy', 'operator']),
            _isHidden: true,
            _choices: this._operators && this._operators.length ? this._operators.map(oper => {
              return {_name: `${oper.firstName} ${oper.lastName}`, _alias: `${oper.firstName} ${oper.lastName}`};
            }) : []
          },
          {
            _attrs: ['mission.type'],
            _name: 'Type',
            _type: 'MULTI-CHOICES',
            _isHidden: true,
            _isSearchable: this.canAccess(['filterBy', 'type']),
            _choices: [
              {_name: 'USER', _alias: 'User'},
              {_name: 'CLIENT', _alias: 'Client'},
              {_name: 'DEMO', _alias: 'Demo'},
              {_name: 'TEST', _alias: 'Test'},
            ]
          },
          {
            _attrs: [this._useCaseSearchKey],
            _name: 'Use case',
            _type: 'MULTI-CHOICES',
            _isSearchable: this.canAccess(['filterBy', 'objective']),
            _isHidden: true,
            _choices: this._missionTemplates.map((_template) => {
              const label = MissionFrontService.objectiveName(_template, this._currentLang);
              return {_name: label, _alias: label};
            })
          },
          {
            _attrs: [this._objectiveSearchKey],
            _name: 'Objective',
            _type: 'MULTI-CHOICES',
            _isSearchable: this.canAccess(['filterBy', 'objective']),
            _isHidden: true,
            _choices: ObjectivesPrincipal.map((objective) => {
              return {_name: objective[this._currentLang].label, _alias: objective[this._currentLang].label};
            })
          },
        ];
      default:
        return [
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
          }, // Using _searchConfig for advanced search
          {
            _attrs: ['community'],
            _name: 'Community',
            _width: '120px',
            _type: 'CHECK',
            _isHidden: !this.canAccess(['tableColumns', 'community']),
          },
          {
            _attrs: ['social'],
            _name: 'Social',
            _width: '100px',
            _type: 'CHECK',
            _isHidden: !this.canAccess(['tableColumns', 'social']),
          },
          {
            _attrs: ['website'],
            _name: 'Website',
            _width: '100px',
            _type: 'CHECK',
            _isHidden: !this.canAccess(['tableColumns', 'website']),
          },
          {
            _attrs: ['isPublic'],
            _name: 'Published Showroom',
            _type: 'MULTI-CHOICES',
            _width: '200px',
            _isHidden: !this.canAccess(['tableColumns', 'isPublic']),
            _choices: [
              {_name: 'Yes', _alias: 'Yes', _class: 'label is-success'},
              {_name: 'No', _alias: 'No', _class: 'label is-danger'},
            ]
          },
          {
            _attrs: ['published'],
            _name: 'Published Community',
            _type: 'MULTI-CHOICES',
            _width: '200px',
            _isHidden: !this.canAccess(['tableColumns', 'published']),
            _choices: [
              {_name: 'Yes', _alias: 'Yes', _class: 'label is-success'},
              {_name: 'No', _alias: 'No', _class: 'label is-danger'},
            ]
          },
          {
            _attrs: ['emailSent'],
            _name: 'Email sent',
            _type: 'MULTI-CHOICES',
            _width: '150px',
            _isHidden: !this.canAccess(['tableColumns', 'emailSent']),
            _choices: [
              {_name: 'Yes', _alias: 'Yes', _class: 'label is-success'},
              {_name: 'No', _alias: 'No', _class: 'label is-danger'},
            ]
          },
          {
            _attrs: ['emailsOK'],
            _name: 'Good Emails',
            _type: 'NUMBER',
            _isSortable: true,
            _isHidden: !this.canAccess(['tableColumns', 'goodEmails']),
          },
          {
            _attrs: ['validatedAnswers'],
            _name: 'Validated Answers',
            _type: 'NUMBER',
            _width: '170px',
            _isHidden: !this.canAccess(['tableColumns', 'validatedAnswers'])
          },
          {
            _attrs: ['updated'],
            _name: 'Last Updated',
            _type: 'DATE_TIME',
            _isSortable: true,
            _width: '200px',
            _isHidden: !this.canAccess(['tableColumns', 'lastUpdated'])
          },
          {
            _attrs: ['owner.firstName', 'owner.lastName'],
            _name: 'Owner',
            _type: 'TEXT',
            _width: '230px',
            _isHidden: !this.canAccess(['tableColumns', 'owner']),
            _isEditable: true,
            _editType: 'USER-INPUT'
          },
          {
            _attrs: ['company'],
            _name: 'Company',
            _type: 'TEXT',
            _width: '180px',
            _isSearchable: this.canAccess(['searchBy', 'company']),
            _isHidden: !this.canAccess(['tableColumns', 'company']),
          },
          {
            _attrs: ['mission.type'],
            _name: 'Type',
            _type: 'TEXT',
            _isSortable: true,
            _isHidden: !this.canAccess(['tableColumns', 'type']),
            _width: '180px',
            _isEditable: true,
            _editType: 'MULTI-CHOICES',
            _choices: [
              {_name: 'USER', _alias: 'User'},
              {_name: 'CLIENT', _alias: 'Client'},
              {_name: 'DEMO', _alias: 'Demo'},
              {_name: 'TEST', _alias: 'Test'},
            ]
          },
          {
            _attrs: ['mainObjective'],
            _name: 'Objective',
            _type: 'TEXT',
            _isHidden: !this.canAccess(['tableColumns', 'objective']),
            _width: '200px'
          },
          {
            _attrs: ['created'],
            _name: 'Created',
            _type: 'DATE',
            _isSortable: true,
            _width: '130px',
            _isHidden: !this.canAccess(['tableColumns', 'created'])
          },
          // Using _searchConfig for advanced search
          {
            _attrs: [this._useCaseSearchKey],
            _name: 'Use case',
            _type: 'MULTI-CHOICES',
            _isSearchable: this.canAccess(['filterBy', 'objective']),
            _isHidden: true,
            _choices: this._missionTemplates.map((_template) => {
              const label = MissionFrontService.objectiveName(_template, this._currentLang);
              return {_name: label, _alias: label};
            })
          },
          // Using _searchConfig for advanced search
          {
            _attrs: [this._objectiveSearchKey],
            _name: 'Objective',
            _type: 'MULTI-CHOICES',
            _isSearchable: this.canAccess(['filterBy', 'objective']),
            _isHidden: true,
            _choices: ObjectivesPrincipal.map((objective) => {
              return {_name: objective[this._currentLang].label, _alias: objective[this._currentLang].label};
            })
          },
          {
            _attrs: ['status'],
            _name: 'Status',
            _type: 'MULTI-CHOICES',
            _isSortable: true,
            _isSearchable: this.canAccess(['filterBy', 'status']),
            _isHidden: !this.canAccess(['tableColumns', 'status']),
            _width: '200px',
            _choices: [
              {_name: 'EDITING', _alias: 'Editing', _class: 'label is-primary'},
              {_name: 'SUBMITTED', _alias: 'Submitted', _class: 'label is-draft'},
              {_name: 'EVALUATING', _alias: 'Evaluating', _class: 'label is-progress'},
              {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
            ],
            _isEditable: true,
            _editType: 'MULTI-CHOICES'
          },
          {
            _attrs: ['operator'],
            _name: 'Operator',
            _type: 'MULTI-CHOICES',
            _isSearchable: this.canAccess(['filterBy', 'operator']),
            _isHidden: true,
            _choices: this._operators && this._operators.length ? this._operators.map(oper => {
              return {_name: `${oper.firstName} ${oper.lastName}`, _alias: `${oper.firstName} ${oper.lastName}`};
            }) : []
          },
          {
            _attrs: ['mission.type'],
            _name: 'Type',
            _type: 'MULTI-CHOICES',
            _isHidden: true,
            _isSearchable: this.canAccess(['filterBy', 'type']),
            _choices: [
              {_name: 'USER', _alias: 'User'},
              {_name: 'CLIENT', _alias: 'Client'},
              {_name: 'DEMO', _alias: 'Demo'},
              {_name: 'TEST', _alias: 'Test'},
            ]
          },
        ];
    }
  }

  /**
   * MTM Umi Back => Type = client
   * @private
   */
  private _setConfigForUmiBack() {
    switch (this._authService.user.roles) {
      case 'market-test-manager-umi-back':
        this._config = {
          fields: '',
          limit: '10',
          offset: '0',
          'mission.type': 'CLIENT',
          search: '{}',
          sort: '{"created":-1}',
        };
        break;
      default:
        break;
    }
  }

  set config(value: UmiusConfigInterface) {
    this._config = value; // TODO how to change the config when searching things like the operator?
    try {
      // Parse the config.search field to see if there's something
      this._getProjects();
    } catch (ex) {
      this._translateNotificationsService.error('Project Fetching Error...', '500.UNKNOWN_ERROR');
      this._getProjects();
      console.error(ex);
    }
  }

  /**
   * @private
   */
  private _configOperator() {
    const operator = this._operators.find((oper) => oper['_id'] === this.authUserId);
    if (!!operator) {
      this._config.operator = `${operator['firstName']} ${operator['lastName']}`;
    }
  }

  /***
   * this is to get the projects from the server.
   * @private
   */
  private _getProjects() {
    this._innovationService.getMarketTests(this._config).pipe(first()).subscribe((response: Response) => {
      this._projects = response && response.result;
      this._initialProjects = JSON.parse(JSON.stringify(this._projects));
      this._initProjects();
      this._totalProjects = response && response._metadata && response._metadata.totalCount;
      this._initializeTable();
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Project Fetching Error...', ErrorFrontService.getErrorKey(err.error));
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
    return new Promise((resolve, reject) => {
      const operatorConfig = <UmiusConfigInterface>{
        fields: 'firstName,lastName',
        limit: '0',
        offset: '0',
        search: '{}',
        sort: '{"firstName":1}',
        domain: environment.domain,
        $or: JSON.stringify([{roles: 'market-test-manager-umi'}, {roles: 'market-test-manager-umi-back'}, {roles: 'oper-supervisor'}])
      };
      this._userService.getAll(operatorConfig).pipe(first()).subscribe(operators => {
        this._operators = operators && operators['result'] ? operators['result'] : [];
        resolve(true);
      }, (err: HttpErrorResponse) => {
        console.error(err);
        reject(err);
      });
    });
  }

  private _initProjects() {
    this._projects = this._projects.map((project) => {

      if (project.innovationCards && project.innovationCards.length) {
        project.innovationCards = InnovationFrontService.currentLangInnovationCard(project, this._currentLang, 'CARD');
      }

      if (!!project.useCase) {
        project.mainObjective = project.useCase[this._currentLang];
      } else if (project.objective) {
        project.mainObjective = project.objective[this._currentLang];
      }

      project.emailSent = project.emailSent ? 'Yes' : 'No';
      project.published = project.published ? 'Yes' : 'No';
      project.isPublic = project.isPublic ? 'Yes' : 'No';
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
      _paginationTemplate: 'TEMPLATE_1',
      _isNoMinHeight: true,
      _columns: this._setColumnOrderForUser()
    };
    this._changeDetectorRef.markForCheck();
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
      this._translateNotificationsService.success('Project Import Success...', 'The project is imported successfully.');
      this._getProjects();
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Project Import Error...', ErrorFrontService.getErrorKey(err.error));
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

  getPerformedAction(event: any) {
    if (event) {
      switch (event._action) {
        case 'Update grid':
          this._update(event._context, event._column, event._value);
          break;
      }
    }
  }

  public isAlreadyDone(innovationId: string): boolean {
    return this._initialProjects.some((_project: Innovation) => _project._id === innovationId && _project.status === 'DONE');
  }

  private _update(context: any, column: any, value: any) {
    switch (column._attrs[0]) {

      case 'status':
        const newStatus = value.toUpperCase();
        this._selectedInnovationId = '';
        if (!this.isAlreadyDone(context._id)) {
          if (newStatus === 'DONE') {
            this._selectedInnovationId = context._id;
            this._showModalDone = true;
          } else {
            const saveObject = {
              status: newStatus
            };
            this._updateInnovation(saveObject, context._id, 'status');
          }
        } else {
          this._rollbackValue(context._id, 'status');
          this._translateNotificationsService.error('Project Status Error...', 'This project status is already Done. ' +
            'It could not be updated.');
        }
        break;

      case 'mission.type':
        const missionObject = {
          type: value.toUpperCase()
        };
        this._updateMission(missionObject, context.mission._id, context._id, 'mission.type');
        break;

      case 'owner.firstName':
        const ownerObject = {
          owner: value
        };
        if (ownerObject.owner && ownerObject.owner._id) {
          this._updateInnovation(ownerObject, context._id, 'owner.firstName');
        }
    }
  }

  private _rollbackValue(projectId: string, field: string) {
    const displayProject = this._projects.find(inno => inno._id === projectId);
    const originalProject = this._initialProjects.find(inno => inno._id === projectId);
    if (displayProject && originalProject) {
      displayProject[field] = originalProject[field];
    }
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   * @param missionObj
   * @param missionId
   * @param projectId
   * @param field
   * @param notifyMessage
   * @private
   */
  private _updateMission(missionObj: any, missionId: string, projectId: string, field: string, notifyMessage = 'The project has been updated.', ) {
    this._missionService.save(missionId, missionObj).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Mission Save Success...', notifyMessage);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Mission Save Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
      this._rollbackValue(projectId, field);
    });
  }

  /**
   *
   * @param notifyMessage
   * @param saveObject
   * @param _innovationId
   * @param field
   * @private
   */
  private _updateInnovation(saveObject: any, _innovationId: string, field: string, notifyMessage = 'The project has been updated.',) {
    this._innovationService.save(_innovationId, saveObject).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Project Save Success...', notifyMessage);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Project Save Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
      this._rollbackValue(_innovationId, field);
    });
  }

  /**
   *
   * @param event
   */
  public onStatusUpdated(event: boolean) {
    if (event) {
      const index = this._projects.findIndex((_project) => _project._id === this._selectedInnovationId);
      if (index !== -1) {
        this._projects[index].status = 'DONE';
        this._initialProjects = JSON.parse(JSON.stringify(this._projects));
      }
    }
  }

  get config(): UmiusConfigInterface {
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

  get authUserId() {
    return this._authService.userId;
  }

  get canImport(): boolean {
    return this._canImport;
  }

  get selectedInnovationId(): string {
    return this._selectedInnovationId;
  }

  get showModalDone(): boolean {
    return this._showModalDone;
  }

  set showModalDone(value: boolean) {
    this._showModalDone = value;
  }
}
