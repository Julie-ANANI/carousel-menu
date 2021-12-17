import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Answer, AnswerStatus } from '../../../../../../models/answer';
import { Campaign } from '../../../../../../models/campaign';
import { SidebarInterface } from '../../../../../sidebars/interfaces/sidebar-interface';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { Config, Table } from '@umius/umi-common-component/models';
import { Response } from '../../../../../../models/response';
import { isPlatformBrowser } from '@angular/common';
import { first } from 'rxjs/operators';
import {ConfigService} from '@umius/umi-common-component/services/config';import { Company } from '../../../../../../models/company';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { QuizService } from '../../../../../../services/quiz/quiz.service';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { StatsInterface } from '../../../../../../models/stats';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';

@Component({
  templateUrl: './admin-campaign-answers.component.html',
})

export class AdminCampaignAnswersComponent implements OnInit {

  private _localConfig: Config = {
    fields: '',
    limit: this._configService.configLimit('admin-campaign-answers-limit'),
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  private _campaign: Campaign = <Campaign>{};

  private _answers: Array<Answer> = [];

  private _totalAnswers = -1;

  private _table: Table = <Table>{};

  private _adminMode = false;

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  private _modalAnswer: Answer = <Answer>{};

  private _questions: Array<any> = [];

  private _excludedCompanies: Array<Company> = [];

  private _isImportingAnswers = false;

  private _quizLinks: Array<string> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _answerService: AnswerService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _configService: ConfigService) { }

  ngOnInit() {
    if (this._activatedRoute.snapshot.parent.data['campaign']
      && typeof this._activatedRoute.snapshot.parent.data['campaign'] !== undefined) {
      this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
      this._initTable();
      this._reinitializeVariables();
      this._getAnswers();
      this._initQuestions();

      if (this._campaign.innovation && this._campaign.innovation.quizId) {
        this._quizLinks = ['fr', 'en'].map((lang) => {
          return QuizService.getQuizUrl(this._campaign, lang);
        });
      }

      this._excludedCompanies = this._campaign.innovation && this._campaign.innovation.settings
        && this._campaign.innovation.settings.companies && this._campaign.innovation.settings.companies.exclude;

    }

  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project', 'campaigns', 'campaign', 'answers'];
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(_default);
    }
  }

  private _reinitializeVariables() {
    this._totalAnswers = -1;
    this._answers = [];
  }

  private _getAnswers() {
    if (isPlatformBrowser(this._platformId)) {
      this._campaignService.getAnswers(this._campaign._id).pipe(first()).subscribe((response: Response) => {
        this._answers = response && response.answers && response.answers.localAnswers || [];
        this._totalAnswers = this._answers.length;
        this._initTable();
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    }
  }

  private _initQuestions() {
    if (this._campaign.innovation) {
      this._questions = InnovationFrontService.questionsList(this._campaign.innovation);
    }
  }

  public onImport(file: File) {
    if (!this._isImportingAnswers) {
      this._isImportingAnswers = true;
      this._answerService.importAsCsv(this._campaign._id, file).pipe(first()).subscribe(() => {
        this._reinitializeVariables();
        this._getAnswers();
        this._translateNotificationsService.success('Success', 'The answers has been imported.');
        this._isImportingAnswers = false;
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isImportingAnswers = false;
        console.error(err);
      });
    }
  }

  public onExport() {
    this._answerService.exportAsCsvByCampaign(this._campaign._id, false);
  }

  private _initTable() {
    this._table = {
      _selector: 'admin-campaign-answers',
      _title: 'answers',
      _content: this._answers,
      _total: this._totalAnswers,
      _isSearchable: !!this.canAccess(['searchBy']) || !!this.canAccess(['filterBy']),
      _isSelectable: this.canAccess(['validate']) || this.canAccess(['reject']),
      _isPaginable: true,
      _clickIndex: (this.canAccess(['view']) || this.canAccess(['edit'])) ? 1 : null,
      _isTitle: true,
      _isLocal: true,
      _isNoMinHeight: this._totalAnswers < 11,
      _buttons: [
        {_label: 'Validate', _icon: 'fas fa-check', _isHidden: !this.canAccess(['validate'])},
        {_label: 'Reject', _icon: 'fas fa-times', _isHidden: !this.canAccess(['reject'])}
        ],
      _columns: [
        {
          _attrs: ['professional.firstName', 'professional.lastName'],
          _name: 'Name',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'name']),
          _isHidden: !this.canAccess(['tableColumns', 'name'])
        },
        {
          _attrs: ['country'],
          _name: 'Country',
          _type: 'COUNTRY',
          _width: '120px',
          _isSearchable: this.canAccess(['searchBy', 'country']),
          _isHidden: !this.canAccess(['tableColumns', 'country'])
        },
        {
          _attrs: ['professional.jobTitle'],
          _name: 'Job',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'job']),
          _isHidden: !this.canAccess(['tableColumns', 'job'])
        },
        {
          _attrs: ['scoreStatus'],
          _name: 'Validation Score',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'validationScore']),
          _isHidden: !this.canAccess(['tableColumns', 'validationScore']),
          _width: '180px'
        },
        {
          _attrs: ['updated'],
          _name: 'Updated',
          _type: 'DATE',
          _width: '150px',
          _isSearchable: this.canAccess(['searchBy', 'updated']),
          _isHidden: !this.canAccess(['tableColumns', 'updated'])
        },
        {
          _attrs: ['created'],
          _name: 'Created',
          _type: 'DATE',
          _width: '150px',
          _isSearchable: this.canAccess(['searchBy', 'created']),
          _isHidden: !this.canAccess(['tableColumns', 'created'])
        },
        {
          _attrs: ['status'],
          _name: 'Status',
          _type: 'MULTI-CHOICES',
          _isSearchable: this.canAccess(['filterBy', 'status']),
          _isHidden: !this.canAccess(['tableColumns', 'status']),
          _width: '180px',
          _choices: [
            {_name: 'VALIDATED', _alias: 'Validated', _class: 'label is-success'},
            {_name: 'SUBMITTED', _alias: 'Submitted', _class: 'label is-progress'},
            {_name: 'REJECTED', _alias: 'Rejected', _class: 'label is-danger'},
            {_name: 'REJECTED_GMAIL', _alias: 'Rejected by mail', _class: 'label is-danger'},
            {_name: 'VALIDATED_UMIBOT', _alias: 'Auto validated', _class: 'label is-progress'},
            {_name: 'REJECTED_UMIBOT', _alias: 'Auto rejected', _class: 'label is-progress'}
          ]
        },
      ]
    };
  }

  public onEdit(answer: Answer) {
    this._modalAnswer = answer;
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Insight',
      size: '726px'
    };
  }

  public onActions(action: any) {
    switch (action._label) {
      case 'Validate':
        this._updateStatus(action._rows, 'VALIDATED');
        break;

      case 'Reject':
        this._updateStatus(action._rows, 'REJECTED');
        break;
    }
  }

  private _updateStatus(answers: Answer[], status: AnswerStatus) {
    answers.forEach((answer: Answer, index) => {
      answer.status = status;
      this._answerService.save(answer._id, answer).pipe(first()).subscribe(() => {
        this._translateNotificationsService.success('Success', 'The answer has been updated.');
        if (index === (answers.length - 1)) {
          this._getAnswers();
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    });
  }

  private _answerStat(type: string, searchKey?: any): number {
    return CampaignFrontService.answerStat(this._answers, type, searchKey);
  }

  public statsConfig(): Array<StatsInterface> {
    return [
      {
        heading: 'Insight',
        content: [
          {subHeading: 'Answer rate', value: this._answerStat('answer_rate').toString(10)},
          {subHeading: 'Validated', value: this._answerStat('status', 'VALIDATED').toString(10)},
          {subHeading: 'Rejected by mail', value: this._answerStat('status', 'REJECTED_GMAIL').toString(10)},
          {subHeading: 'Auto validated', value: this._answerStat('status', 'VALIDATED_UMIBOT').toString(10)},
          {subHeading: 'Auto rejected', value: this._answerStat('status', 'REJECTED_UMIBOT').toString(10)}
          ]
      },
      {
        heading: 'Quality',
        content: [
          {subHeading: 'Fill rate', value: '--'},
          {subHeading: 'Time spent', value: this._answerStat('quality', 'time_elapsed').toString(10)},
        ]
      }
      ];
  }

  get localConfig(): Config {
    return this._localConfig;
  }

  set localConfig(value: Config) {
    this._localConfig = value;
    this._getAnswers();
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get adminMode(): boolean {
    return this._adminMode;
  }

  get table(): Table {
    return this._table;
  }

  get totalAnswers(): number {
    return this._totalAnswers;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get modalAnswer(): Answer {
    return this._modalAnswer;
  }

  set modalAnswer(modalAnswer: Answer) {
    this._modalAnswer = modalAnswer;
  }

  get questions(): Array<any> {
    return this._questions;
  }

  get excludedCompanies(): Array<Company> {
    return this._excludedCompanies;
  }

  get isImportingAnswers(): boolean {
    return this._isImportingAnswers;
  }

  get quizLinks() {
    return this._quizLinks;
  }

}
