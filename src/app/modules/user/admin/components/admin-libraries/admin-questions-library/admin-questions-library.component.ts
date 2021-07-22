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

  get newQuestion(): any {
    return this._newQuestion;
  }

  set newQuestion(value: any) {
    this._newQuestion = value;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }
  get isAdding(): boolean {
    return this._isAdding;
  }

  get questionChoices(): Array<any> {
    return this._questionChoices;
  }

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

  private _questionChoices: Array<any> = [
    {_name: 'radio', _alias: 'Unique choice', _class: 'label bg-white p-no text-13 text-normal w-auto'},
    {_name: 'checkbox', _alias: 'Multiple choice', _class: 'label bg-white p-no text-13 text-normal w-auto'},
    {_name: 'stars', _alias: 'Stars rating', _class: 'label bg-white p-no text-13 text-normal w-auto'},
    {_name: 'textarea', _alias: 'Text', _class: 'label bg-white p-no text-13 text-normal w-auto'},
    {_name: 'ranking', _alias: 'Ranking', _class: 'label bg-white p-no text-13 text-normal w-auto'},
    {_name: 'scale', _alias: 'Rating', _class: 'label bg-white p-no text-13 text-normal w-auto'},
  ];

  private _isAdding = false;

  private _showModal = false;

  private _newQuestion: any = '';

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
    if (isPlatformBrowser(this._platformId) && this.canAccess()) {
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
      _title: 'question(s)',
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
          _type: 'MULTI-CHOICES',
          _width: '150px',
          _choices: this._questionChoices
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
          _width: '150px',
          _isSortable: true
        },
        {
          _attrs: ['created'],
          _name: 'Created',
          _type: 'DATE',
          _width: '150px',
          _isSortable: true
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
  public onNavigateTo(event: MissionQuestion) {
    this._missionQuestionService.setQuestion(this._missionQuestionService.allQuestions.find((_question) => {
      return _question._id === event._id;
    }));
    this._router.navigate([`${this._router.url}/${event._id}`]);
  }

  public onAddQuestion(event: Event) {
    event.preventDefault();
    if (this.canAccess(['add']) && !this._isAdding) {
      this._newQuestion = '';
      this._showModal = true;
    }
  }

  public onCreate(event: Event) {
    event.preventDefault();
    if (!this._isAdding) {
      this._isAdding = true;
      const question = this._missionQuestionService.createQuestion(this._newQuestion);

      this._missionService.createQuestion(question).pipe(first()).subscribe((response) => {
        this._router.navigate([`${this._router.url}/${response._id}`]);
        this.onCloseModal();
      }, error => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(error));
        this._isAdding = false;
        console.error(error);
      });
    }
  }

  public onCloseModal() {
    this._showModal = false;
  }

}
