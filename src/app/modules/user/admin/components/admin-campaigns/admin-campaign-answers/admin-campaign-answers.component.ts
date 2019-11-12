import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Answer } from '../../../../../../models/answer';
import { Campaign } from '../../../../../../models/campaign';
import { Question } from '../../../../../../models/question';
import { Section } from '../../../../../../models/section';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { SidebarInterface } from '../../../../../sidebars/interfaces/sidebar-interface';
import { Table } from '../../../../../table/models/table';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { Config } from '../../../../../../models/config';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { Response } from '../../../../../../models/response';
import { isPlatformBrowser } from '@angular/common';
import { first } from 'rxjs/operators';
import { ConfigService } from '../../../../../../services/config/config.service';

@Component({
  selector: 'app-admin-campaign-answers',
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

  private _campaign: Campaign;

  private _answers: Array<Answer> = [];

  private _total: number;

  private _fetchingError: boolean;

  private _table: Table;

  private _adminMode: boolean;

  private _noResult: boolean;

  private _sidebarValue: SidebarInterface = {};

  private _modalAnswer: Answer = null;

  private _questions: Array<Question> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _translateTitleService: TranslateTitleService,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _authService: AuthService,
              private _configService: ConfigService,
              private _campaignFrontService: CampaignFrontService) {

    this._translateTitleService.setTitle('Answers | Campaign');
    this._adminMode = this._authService.adminLevel > 2 || (this._authService.adminLevel > 0 && this._authService.isOperator);

    if (this._activatedRoute.snapshot.parent.data['campaign']) {
      this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
      this._getQuestions();
    }

  }

  ngOnInit() {

    if (isPlatformBrowser(this._platformId)) {
      this._campaignService.getAnswers(this._campaign._id).pipe(first()).subscribe((response: Response) => {
        this._answers = response.answers.localAnswers;
        this._total = this._answers.length;
        this._noResult = this._total === 0;
        this._initializeTable();
      }, () => {
        this._fetchingError = true;
      });
    }

  }

  private _getQuestions() {
    if (this._campaign && this._campaign.innovation.preset && this._campaign.innovation.preset.sections && Array.isArray(this._campaign.innovation.preset.sections)) {
      this._campaign.innovation.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions || []);
      });
    }
  }

  public onClickImport(file: File) {
    this._answerService.importAsCsv(this._campaign._id, file).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ANSWER.IMPORTED');
      this._getAnswers();
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public onClickExport() {
    this._answerService.exportAsCsvByCampaign(this._campaign._id, false);
  }

  private _getAnswers() {
    this._campaignService.getAnswers(this._campaign._id).pipe(first()).subscribe((response: Response) => {
      this._answers = response.answers.localAnswers;
      this._total = this._answers.length;
      this._noResult = this._config.search.length > 2 || this._config.status ? false : this._total === 0;
      this._initializeTable();
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }

  private _initializeTable() {
    this._table = {
      _selector: 'admin-campaign-answers',
      _title: 'TABLE.TITLE.ANSWERS',
      _content: this._answers,
      _total: this._total,
      _isSearchable: true,
      _isSelectable: true,
      _isPaginable: true,
      _isEditable: true,
      _clickIndex: 1,
      _isTitle: true,
      _isLocal: true,
      _buttons: [{_label: 'ANSWER.VALID_ANSWER', _icon: 'fas fa-check'}, {_label: 'ANSWER.REJECT_ANSWER', _icon: 'fas fa-times'}],
      _columns: [
        {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT', _isSearchable: true},
        {_attrs: ['country'], _name: 'TABLE.HEADING.COUNTRY', _type: 'COUNTRY', _isSearchable: true },
        {_attrs: ['professional.jobTitle'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT', _isSearchable: true},
        {_attrs: ['scoreStatus'], _name: 'TABLE.HEADING.SCORE', _type: 'TEXT', _isSearchable: true},
        {_attrs: ['updated'], _name: 'TABLE.HEADING.UPDATED', _type: 'DATE'},
        {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE'},
        {_attrs: ['status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES', _isSearchable: true,
          _choices: [
            {_name: 'VALIDATED', _alias: 'TABLE.STATUS.VALIDATED', _class: 'label is-success'},
            {_name: 'SUBMITTED', _alias: 'TABLE.STATUS.SUBMITTED', _class: 'label is-progress'},
            {_name: 'REJECTED', _alias: 'TABLE.STATUS.REJECTED', _class: 'label is-danger'},
            {_name: 'REJECTED_GMAIL', _alias: 'TABLE.STATUS.REJECTED_GMAIL', _class: 'label is-danger'},
            {_name: 'VALIDATED_UMIBOT', _alias: 'TABLE.STATUS.VALIDATED_UMIBOT', _class: 'label is-progress'},
            {_name: 'REJECTED_UMIBOT', _alias: 'TABLE.STATUS.REJECTED_UMIBOT', _class: 'label is-progress'}
          ]
        },
      ]
    };
  }

  public campaignStat(type: string, searchKey: any): number {
    return this._campaignFrontService.getAnswerCampaignStat(this._answers, type, searchKey);
  }

  public authorizedActions(level: number): boolean {
    return this._authService.adminLevel > level;
  }

  public onClickEdit(value: Answer) {
    this._modalAnswer = value;

    this._sidebarValue = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.EDIT_INSIGHT',
      size: '726px'
    };

  }

  public onClickActions(action: any) {
    switch (action._label) {

      case 'ANSWER.VALID_ANSWER':
        this._updateStatus(action._rows, 'VALIDATED');
        break;

      case 'ANSWER.REJECT_ANSWER':
        this._updateStatus(action._rows, 'REJECTED');
        break;
    }
  }

  private _updateStatus(rows: Answer[], status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED'
    | 'VALIDATED' | 'VALIDATED_UMIBOT' | 'REJECTED_UMIBOT') {
    rows.forEach((row: Answer) => {
      row.status = status;
      this._answerService.save(row._id, row).subscribe(() => {
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ANSWER.STATUS_UPDATE');
        this._getAnswers();
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
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

  get total(): number {
    return this._total;
  }

  get noResult(): boolean {
    return this._noResult;
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

}
