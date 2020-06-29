import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Answer, AnswerStatus } from '../../../../../../models/answer';
import { Campaign } from '../../../../../../models/campaign';
import { Question } from '../../../../../../models/question';
import { Section } from '../../../../../../models/section';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { SidebarInterface } from '../../../../../sidebars/interfaces/sidebar-interface';
import { Table } from '../../../../../table/models/table';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { Config } from '../../../../../../models/config';
import { Response } from '../../../../../../models/response';
import { isPlatformBrowser } from '@angular/common';
import { first } from 'rxjs/operators';
import { ConfigService } from '../../../../../../services/config/config.service';
import { Company } from '../../../../../../models/company';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { QuizService } from '../../../../../../services/quiz/quiz.service';

@Component({
  templateUrl: './admin-campaign-answers.component.html',
  styleUrls: ['./admin-campaign-answers.component.scss']
})

export class AdminCampaignAnswersComponent implements OnInit {

  private _config: Config = {
    fields: '',
    limit: this._configService.configLimit('admin-campaign-answers-limit'),
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  private _campaign: Campaign = <Campaign>{};

  private _answers: Array<Answer> = [];

  private _totalAnswers = -1;

  private _fetchingError = true;

  private _table: Table = <Table>{};

  private _adminMode = false;

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  private _modalAnswer: Answer = <Answer>{};

  private _questions: Array<Question> = [];

  private _excludedCompanies: Array<Company> = [];

  private _isImportingAnswers = false;

  private _quizLinks: Array<string> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _authService: AuthService,
              private _configService: ConfigService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this._adminMode = this._authService.adminLevel > 2 || (this._authService.adminLevel > 0 && this._authService.isOperator);

    if (this._campaign._id) {
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
    } else {
      this._fetchingError = true;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage());
    }

  }

  private _reinitializeVariables() {
    this._totalAnswers = -1;
    this._answers = [];
  }

  private _getAnswers() {
    if (isPlatformBrowser(this._platformId)) {
      this._campaignService.getAnswers(this._campaign._id).pipe(first()).subscribe((response: Response) => {
        this._answers = response.answers && response.answers.localAnswers;
        this._totalAnswers = this._answers.length;
        this._fetchingError = false;
        this._initTable();
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      });
    }
  }

  private _initQuestions() {
    if (this._campaign.innovation && this._campaign.innovation.preset && this._campaign.innovation.preset.sections
      && Array.isArray(this._campaign.innovation.preset.sections)) {
      this._campaign.innovation.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions || []);
      });
    }
  }

  public onImport(file: File) {
    if (!this._isImportingAnswers) {
      this._isImportingAnswers = true;
      this._answerService.importAsCsv(this._campaign._id, file).pipe(first()).subscribe(() => {
        this._reinitializeVariables();
        this._getAnswers();
        this._translateNotificationsService.success('Success', 'The answers has been imported successfully.');
        this._isImportingAnswers = false;
      }, (err: HttpErrorResponse) => {
        this._isImportingAnswers = false
        console.error(err);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
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
      _isSearchable: true,
      _isSelectable: true,
      _isPaginable: true,
      _isEditable: true,
      _clickIndex: 1,
      _isTitle: true,
      _isLocal: true,
      _buttons: [{_label: 'Validate', _icon: 'fas fa-check'}, {_label: 'Reject', _icon: 'fas fa-times'}],
      _columns: [
        {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'Name', _type: 'TEXT', _isSearchable: true},
        {_attrs: ['country'], _name: 'Country', _type: 'COUNTRY', _isSearchable: true, _width: '120px' },
        {_attrs: ['professional.jobTitle'], _name: 'Job', _type: 'TEXT', _isSearchable: true},
        {_attrs: ['scoreStatus'], _name: 'Validation Score', _type: 'TEXT', _isSearchable: true, _width: '180px'},
        {_attrs: ['updated'], _name: 'Updated', _type: 'DATE', _width: '150px'},
        {_attrs: ['created'], _name: 'Created', _type: 'DATE', _width: '150px'},
        {_attrs: ['status'], _name: 'Status', _type: 'MULTI-CHOICES', _isSearchable: true, _width: '180px',
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

  public campaignStat(type: string, searchKey?: any): number {
    return CampaignFrontService.answerStat(this._answers, type, searchKey);
  }

  public authorizedActions(level: number): boolean {
    return this._authService.adminLevel > level;
  }

  public onEdit(answer: Answer) {
    this._modalAnswer = answer;
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Edit Insight',
      size: '726px'
    };
  }

  public onActions(action: any) {
    switch (action._label) {
      case 'ANSWER.VALID_ANSWER':
        this._updateStatus(action._rows, 'VALIDATED');
        break;

      case 'ANSWER.REJECT_ANSWER':
        this._updateStatus(action._rows, 'REJECTED');
        break;
    }
  }

  private _updateStatus(answers: Answer[], status: AnswerStatus) {
    answers.forEach((answer: Answer) => {
      answer.status = status;
      this._answerService.save(answer._id, answer).pipe(first()).subscribe(() => {
        this._getAnswers();
        this._translateNotificationsService.success('Success', 'The answer has been updated successfully.');
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      });
    });
  }

  public updateAnswer(value: boolean) {
    this._getAnswers();
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    this._getAnswers();
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
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

  get questions(): Array<Question> {
    return this._questions;
  }

  get excludedCompanies(): Array<Company> {
    return this._excludedCompanies;
  }

  get isImportingAnswers(): boolean {
    return this._isImportingAnswers;
  }

  get quizLinks() {
    return this._quizLinks
  }

}
