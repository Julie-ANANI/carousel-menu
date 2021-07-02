import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Table} from '../../../../../table/models/table';
import {Config} from '../../../../../../models/config';
import {MissionService} from '../../../../../../services/mission/mission.service';
import {isPlatformBrowser} from '@angular/common';
import {MissionTemplate} from '../../../../../../models/mission';
import {first} from 'rxjs/operators';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {MissionFrontService} from '../../../../../../services/mission/mission-front.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {MissionQuestionService} from '../../../../../../services/mission/mission-question.service';

@Component({
  selector: 'app-admin-use-cases-library',
  templateUrl: './admin-use-cases-library.component.html',
  styleUrls: ['./admin-use-cases-library.component.scss']
})
export class AdminUseCasesLibraryComponent implements OnInit {

  set config(value: Config) {
    this._config = value;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get templates(): Array<MissionTemplate> {
    return this._templates;
  }

  get config(): Config {
    return this._config;
  }

  get total(): number {
    return this._total;
  }

  get tableData(): Table {
    return this._tableData;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  private _tableData = <Table>{};

  private _total = -1;

  private _config: Config = {
    fields: '',
    limit: '0',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _templates: Array<MissionTemplate> = [];

  private _fetchingError = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _rolesFrontService: RolesFrontService,
              private _router: Router,
              private _missionQuestionService: MissionQuestionService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _missionService: MissionService) { }

  ngOnInit() {
    this._initializeTable();
    this._getAllTemplates();
  }

  private _getAllTemplates() {
    if (isPlatformBrowser(this._platformId)) {
      this._missionService.getAllTemplates(this._config).pipe(first()).subscribe((response) => {
        this._templates = response && response.result || [];
        this._total = response && response._metadata && response._metadata.totalCount || 0;
        this._templates.map((_template) => {
          _template['name'] = MissionFrontService.objectiveName(_template, this.currentLang);
          _template['totalQuestions'] = MissionFrontService.totalTemplateQuestions(_template);
          _template['essentialsQuestions'] = MissionFrontService.essentialsObjectives(_template['totalQuestions']);
          _template['complementaryQuestions'] = MissionFrontService.complementaryObjectives(_template['totalQuestions']);
          return _template;
        });
        this._initializeTable();
      }, error => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
        this._fetchingError = true;
        console.error(error);
      });
    }
  }

  private _initializeTable() {
    this._tableData = {
      _selector: 'admin-use-cases-limit',
      _title: 'use case(s)',
      _content: this._templates,
      _total: this._total,
      _isEditable: this.canAccess(['edit']),
      _isTitle: true,
      _clickIndex: 1,
      _isNoMinHeight: true,
      _isPaginable: true,
      _columns: [
        {
          _attrs: ['name'],
          _name: 'Name',
          _type: 'TEXT',
        },
        {
          _attrs: ['sections'],
          _name: 'Total Sections',
          _type: 'LENGTH',
          _width: '180px'
        },
        {
          _attrs: ['essentialsQuestions'],
          _name: 'Essentials',
          _type: 'LENGTH',
          _width: '180px'
        },
        {
          _attrs: ['complementaryQuestions'],
          _name: 'Complementary',
          _type: 'LENGTH',
          _width: '180px'
        },
        {
          _attrs: ['totalQuestions'],
          _name: 'Total Questions',
          _type: 'LENGTH',
          _width: '180px'
        },
        {
          _attrs: ['created'],
          _name: 'Created',
          _type: 'DATE',
          _width: '150px'
        },
        {
          _attrs: ['updated'],
          _name: 'Updated',
          _type: 'DATE',
          _width: '150px'
        },
      ]
    };
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['libraries', 'useCases'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['libraries', 'useCases']);
    }
  }

  public navigateTo(event: MissionTemplate) {
    this._missionQuestionService.setMissionTemplate(event);
    this._router.navigate([`${this._router.url}/${event._id}`]);
  }

}
