import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Table} from '../../../../../table/models/table';
import {Config} from '../../../../../../models/config';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {TranslateService} from '@ngx-translate/core';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {MissionService} from '../../../../../../services/mission/mission.service';
import {MissionQuestion} from '../../../../../../models/mission';
import {MissionQuestionService} from '../../../../../../services/mission/mission-question.service';
import {Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {first} from 'rxjs/operators';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {ConfigService} from '../../../../../../services/config/config.service';

@Component({
  selector: 'app-admin-questions-library',
  templateUrl: './admin-questions-library.component.html',
  styleUrls: ['./admin-questions-library.component.scss']
})
export class AdminQuestionsLibraryComponent implements OnInit {

  get questions(): Array<MissionQuestion> {
    return this._questions;
  }

  set config(value: Config) {
    this._config = value;
    this._getAllQuestions();
  }

  get fetchingError(): boolean {
    return this._fetchingError;
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
    limit: this._configService.configLimit('admin-questions-limit'),
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _fetchingError = false;

  private _questions: Array<MissionQuestion> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _rolesFrontService: RolesFrontService,
              private _translateService: TranslateService,
              private _router: Router,
              private _configService: ConfigService,
              private _missionQuestionService: MissionQuestionService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _missionService: MissionService) { }

  ngOnInit() {
    this._getAllQuestions();
    this._initializeTable();
  }

  private _getAllQuestions() {
    if (isPlatformBrowser(this._platformId)) {
      this._missionService.getAllQuestions(this._config).pipe(first()).subscribe((response) => {
        this._questions = response && response.result || [];
        this._missionQuestionService.setAllQuestions(JSON.parse(JSON.stringify(response.result)));
        this._total = response && response._metadata && response._metadata.totalCount || 0;
        this._questions.map((_question) => {
          _question.entry = MissionQuestionService.entryInfo(_question, this.currentLang);
          return _question;
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
      _selector: 'admin-questions-limit',
      _title: 'questions(s)',
      _content: this._questions,
      _total: this._total,
      _isEditable: this.canAccess(['edit']),
      _isTitle: true,
      _clickIndex: 1,
      _isPaginable: true,
      _columns: [
        {
          _attrs: ['entry.label'],
          _name: 'Name',
          _type: 'TEXT',
        },
        {
          _attrs: ['entry.objective'],
          _name: 'Objective',
          _type: 'TEXT',
        },
        {
          _attrs: ['entry.title'],
          _name: 'Synthesis Title',
          _type: 'TEXT',
        },
        {
          _attrs: ['entry.subtitle'],
          _name: 'Synthesis Subtitle',
          _type: 'TEXT',
        },
        {
          _attrs: ['controlType'],
          _name: 'Type',
          _type: 'TEXT',
          _width: '120px'
        },
        {
          _attrs: ['identifier'],
          _name: 'Identifier',
          _type: 'TAG'
        },
        {
          _attrs: ['updated'],
          _name: 'Updated',
          _type: 'DATE',
          _width: '150px'
        },
        {
          _attrs: ['created'],
          _name: 'Created',
          _type: 'DATE',
          _width: '150px'
        }
      ]
    };
  }

  /**
   * to check the user has access to the defined functionality on the page or not.
   *
   * @param path
   */
  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['libraries', 'questions'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['libraries', 'questions']);
    }
  }

  /**
   * before navigating to the edit question we set the question in the service so that
   * we can access question in the page without calling the back.
   *
   * @param event
   */
  public navigateTo(event: MissionQuestion) {
    this._missionQuestionService.setQuestion(this._missionQuestionService.allQuestions.find((_question) => {
      return _question._id === event._id;
    }));
    this._router.navigate([`${this._router.url}/${event._id}`]);
  }

}
