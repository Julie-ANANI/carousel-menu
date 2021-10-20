import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../models/innovation';
import { first } from 'rxjs/operators';
import { Response } from '../../../../../models/response';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
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
import { Mission, MissionTemplate } from '../../../../../models/mission';
import { MissionService } from '../../../../../services/mission/mission.service';
import { MissionFrontService } from '../../../../../services/mission/mission-front.service';
import { Table, Config, Column } from '@umius/umi-common-component/src/lib/models';
import {ConfigService} from '@umius/umi-common-component/src/lib/services/config';

@Component({
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})

export class AdminProjectsComponent implements OnInit {

  private _projects: Array<any> = [];

  private _totalProjects = -1;

  private _table: Table = <Table>{};

  private _config: Config = {
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

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _rolesFrontService: RolesFrontService,
              private _authService: AuthService,
              private _translateTitleService: TranslateTitleService,
              private _missionService: MissionService,
              private _userService: UserService) {
    this._translateTitleService.setTitle('Market Tests');
  }

  ngOnInit(): void {
    this._initializeTable();
    this._getMissionTemplates();

    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._setConfigForUmiBack();
      this._getOperators().then(_ => {
        if (this._authService.user && this._authService.user.roles !== 'market-test-manager-umi-back') {
          this._configOperator();
        }
        this._getInnovations();
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isLoading = false;
        this._fetchingError = true;
        console.error(err);
      });
    }

  }

  private _getMissionTemplates() {
    if (isPlatformBrowser(this._platformId)) {
      this._missionService.getAllTemplates().pipe(first()).subscribe((response) => {
        this._missionTemplates = response && response.result || [];
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
              {_name: 'EDITING', _alias: 'Editing', _class: 'label is-secondary'},
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
            _isEditable: this.canAccess(['canEdit', 'type']),
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
              {_name: 'EDITING', _alias: 'Editing', _class: 'label is-secondary'},
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
            _isEditable: this.canAccess(['canEdit', 'type']),
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
            _isEditable: this.canAccess(['canEdit', 'owner']),
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
            _isEditable: this.canAccess(['canEdit', 'type']),
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
              {_name: 'EDITING', _alias: 'Editing', _class: 'label is-secondary'},
              {_name: 'SUBMITTED', _alias: 'Submitted', _class: 'label is-draft'},
              {_name: 'EVALUATING', _alias: 'Evaluating', _class: 'label is-progress'},
              {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
            ],
            _isEditable: this.canAccess(['canEdit', 'status']),
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

  set config(value: Config) {
    this._config = value; // TODO how to change the config when searching things like the operator?
    try {
      // Parse the config.search field to see if there's something
      this._getInnovations();
    } catch (ex) {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(ex.status));
      this._getProjects();
      console.error(ex);
    }
  }

  private _getInnovations() {
    this._getProjects();
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

  get authUserId() {
    return this._authService.userId;
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
    return new Promise((resolve, reject) => {
      const operatorConfig = <Config>{
        fields: 'firstName,lastName',
        limit: '20',
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

      if (project.emailSent) {
        project['emailSent'] = 'Yes';
      } else {
        project['emailSent'] = 'No';
      }

      if (project.published) {
        project['published'] = 'Yes';
      } else {
        project['published'] = 'No';
      }

      if (project.isPublic) {
        project['isPublic'] = 'Yes';
      } else {
        project['isPublic'] = 'No';
      }


      // project.emailSent = (project.emailSent) ? 'Yes' : 'No';
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
      _isNoMinHeight: true,
      _columns: this._setColumnOrderForUser()
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

  getPerformedAction(event: any) {
    if (event) {
      switch (event._action) {
        case 'Update grid':
          this._update(event._context, event._column, event._value);
          break;
      }
    }
  }

  private _update(context: any, column: any, value: any) {
    switch (column._attrs[0]) {
      case 'status':
        const saveObject = {
          status: value
        };
        this._updateInnovation('The project has been updated.', saveObject, context._id);
        break;
      case 'mission.type':
        const missionObject = {
          type: value
        };
        this._updateMission(missionObject, context.mission._id);
        break;
      case 'owner.firstName':
        const ownerObject = {
          owner: value
        };
        if (ownerObject.owner && ownerObject.owner._id) {
          this._updateInnovation('The project has been updated.', ownerObject, context._id);
        }
    }
  }

  private _updateMission(missionObj: { [P in keyof Mission]?: Mission[P] }, missionId: any,
                         notifyMessage = 'The project has been updated.') {
    this._missionService
      .save(missionId, missionObj)
      .pipe(first())
      .subscribe(
        (mission) => {
          this._translateNotificationsService.success('Success', notifyMessage);
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Mission Error...',
            ErrorFrontService.getErrorMessage(err.status)
          );
          console.error(err);
        }
      );
  }

  private _updateInnovation(notifyMessage = 'The project has been updated.', saveObject: any, _innovationId: any) {
    this._innovationService
      .save(_innovationId, saveObject)
      .pipe(first())
      .subscribe(
        (res) => {
          this._translateNotificationsService.success('Success', notifyMessage);
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'Project Error...',
            ErrorFrontService.getErrorMessage(err.status)
          );
          console.error(err);
        }
      );
  }


}
