import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Answer } from '../../../../../../models/answer';
import { Campaign } from '../../../../../../models/campaign';
import { Question } from '../../../../../../models/question';
import { Section } from '../../../../../../models/section';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';
import { Table } from '../../../../../table/models/table';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { Config } from '../../../../../../models/config';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { Response } from '../../../../../../models/response';

@Component({
  selector: 'app-admin-campaign-answers',
  templateUrl: './admin-campaign-answers.component.html',
  styleUrls: ['./admin-campaign-answers.component.scss']
})

export class AdminCampaignAnswersComponent implements OnInit {

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _campaign: Campaign;

  private _answers: Array<Answer> = [];

  private _total: number;

  fetchingError: boolean;

  errorMessage: string;

  private _questions: Array<Question> = [];

  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: Answer = null;

  private _sidebarValue: SidebarInterface = {};

  private _adminMode = true;

  private _tableInfos: Table;

  private _noResult = false;

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _translateTitleService: TranslateTitleService,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _authService: AuthService,
              private _campaignFrontService: CampaignFrontService) {

    this._translateTitleService.setTitle('Answers | Campaign');
    this._adminMode = this._authService.adminLevel > 2;

    if (this._activatedRoute.snapshot.parent.data['campaign']) {
      this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    }

  }

  ngOnInit() {

    if (this._activatedRoute.snapshot.parent.data.campaign_answers && this._activatedRoute.snapshot.parent.data.campaign_answers.answers
      && this._activatedRoute.snapshot.parent.data.campaign_answers.answers.localAnswers
      && Array.isArray(this._activatedRoute.snapshot.parent.data.campaign_answers.answers.localAnswers)) {
      this._answers = this._activatedRoute.snapshot.parent.data.campaign_answers.answers.localAnswers;
      this._total = this._answers.length;
      //this._initializeTable();
    } else if (this._activatedRoute.snapshot.parent.data.campaign_answers && this._activatedRoute.snapshot.parent.data.campaign_answers.answers) {
      this.errorMessage = 'CAMPAIGNS.ERROR_MESSAGE.FETCHING';
      this.fetchingError = true;
    } else {
      this.errorMessage = 'ERROR.ERRORS.FETCHING';
      this.fetchingError = true;
    }

    //this.loadAnswers();

    if (this._campaign && this._campaign.innovation.preset && Array.isArray(this._campaign.innovation.preset.sections)) {
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
    this._campaignService.getAnswers(this._campaign._id).subscribe((response: Response) => {
      this._answers = response.answers.localAnswers;
      this._total = this._answers.length;
      this.loadTable();
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  private loadAnswers() {
    this._campaignService.getAnswers(this._campaign._id).subscribe((result: { answers: { localAnswers: Array<Answer>, draftAnswers: Array<Answer> } }) => {
      this._answers = result.answers.localAnswers;
      this._noResult = this._answers.length === 0;
      this.loadTable();
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  public campaignStat(type: string, searchKey: any): number {
    return this._campaignFrontService.getAnswerCampaignStat(this._answers, type, searchKey);
  }


  public authorizedActions(level: number): boolean {
    return this._authService.adminLevel > level;
  }








  private loadTable() {
    if (this._answers) {
      this._tableInfos = {
        _selector: 'admin-answers',
        _title: 'answer(s)',
        _content: this._answers,
        _total: this._answers.length,
        _isSearchable: true,
        _isSelectable: true,
        _isPaginable: true,
        _isEditable: true,
        _editIndex: 1,
        _isTitle: true,
        _isLocal: true,
        _buttons: [{_label: 'ANSWER.VALID_ANSWER', _icon: 'fas fa-check'}, {_label: 'ANSWER.REJECT_ANSWER', _icon: 'fas fa-times'}],
        _columns: [
          {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT', _isSearchable: true},
          {_attrs: ['country'], _name: 'TABLE.HEADING.COUNTRY', _type: 'COUNTRY', _isSearchable: true},
          {_attrs: ['professional.email'], _name: 'TABLE.HEADING.EMAIL_ADDRESS', _type: 'TEXT'},
          {_attrs: ['professional.jobTitle'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT', _isSearchable: true},
          {_attrs: ['scoreStatus'], _name: 'TABLE.HEADING.SCORE', _type: 'TEXT', _isSearchable: true},
          {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE'},
          {_attrs: ['updated'], _name: 'TABLE.HEADING.UPDATED', _type: 'DATE'},
          {_attrs: ['status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES', _isSearchable: true,
            _choices: [
              {_name: 'VALIDATED', _alias: 'TABLE.STATUS.VALIDATED', _class: 'label label-success'},
              {_name: 'VALIDATED_NO_MAIL', _alias: 'TABLE.STATUS.VALIDATED_NO_MAIL', _class: 'label label-success'},
              {_name: 'SUBMITTED', _alias: 'TABLE.STATUS.SUBMITTED', _class: 'label label-progress'},
              {_name: 'REJECTED', _alias: 'TABLE.STATUS.REJECTED', _class: 'label label-alert'},
              {_name: 'REJECTED_GMAIL', _alias: 'TABLE.STATUS.REJECTED_GMAIL', _class: 'label label-alert'},
              {_name: 'VALIDATED_UMIBOT', _alias: 'TABLE.STATUS.VALIDATED_UMIBOT', _class: 'label label-progress'},
              {_name: 'REJECTED_UMIBOT', _alias: 'TABLE.STATUS.REJECTED_UMIBOT', _class: 'label label-progress'}
            ]
          },
        ]
      };
    }
  }


  onClickEdit(answer: Answer) {
    this._modalAnswer = answer;

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.EDIT_INSIGHT',
      size: '726px'
    };

  }


  onTableAction(action: any) {
    switch (action._label) {

      case 'ANSWER.VALID_ANSWER':
        this.updateStatus(action._rows, 'VALIDATED_NO_MAIL');
        break;

      case 'ANSWER.REJECT_ANSWER':
        this.updateStatus(action._rows, 'REJECTED');
        break;
    }
  }


  private updateStatus(rows: Answer[], status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED_NO_MAIL'
    | 'VALIDATED' | 'VALIDATED_UMIBOT' | 'REJECTED_UMIBOT') {
    rows.forEach((row: Answer) => {
      row.status = status;
      this._answerService.save(row._id, row).subscribe(() => {
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ANSWER.STATUS_UPDATE');
        this.loadAnswers();
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });
    });
  }


  updateAnswer(value: boolean) {
    this.loadAnswers();
  }

  set config(value: Config) {
    this._config = value;
    this.loadAnswers();
  }

  get config(): Config {
    return this._config;
  }

  get questions() {
    return this._questions;
  }

  get modalAnswer() {
    return this._modalAnswer;
  }

  set modalAnswer(modalAnswer: Answer) {
    this._modalAnswer = modalAnswer;
  }

  get total() {
    return this._total;
  }

  get campaign() {
    return this._campaign;
  }

  get answers() {
    return this._answers;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get adminMode(): boolean {
    return this._adminMode;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get noResult(): boolean {
    return this._noResult;
  }

}
