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

@Component({
  selector: 'app-admin-campaign-answers',
  templateUrl: './admin-campaign-answers.component.html',
  styleUrls: ['./admin-campaign-answers.component.scss']
})

export class AdminCampaignAnswersComponent implements OnInit {

  private _campaign: Campaign;

  private _answers: Array<Answer> = [];

  private _total = 0;

  private _questions: Array<Question> = [];

  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: Answer = null;

  private _sidebarValue: SidebarInterface = {};

  private _adminMode = true;

  private _tableInfos: Table = null;

  private _actions: string[] = [];

  private _config = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  private _noResult = false;

  constructor(private activatedRoute: ActivatedRoute,
              private campaignService: CampaignService,
              private answerService: AnswerService,
              private translateNotificationsService: TranslateNotificationsService,
              private authService: AuthService,
              private campaignFrontService: CampaignFrontService) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];
    this._adminMode = this.authService.adminLevel > 2;
    this.loadAnswers();

    if (this._campaign && this._campaign.innovation.preset && Array.isArray(this._campaign.innovation.preset.sections)) {
      this._campaign.innovation.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions || []);
      });

    }
  }


  private loadAnswers() {
    this.campaignService.getAnswers(this._campaign._id).subscribe((result: { answers: { localAnswers: Array<Answer>, draftAnswers: Array<Answer> } }) => {
      this._answers = result.answers.localAnswers;
      this._noResult = this._answers.length === 0;
      this.loadTable();
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  getCampaignStat(type: string, searchKey: any): number {
    if (this._answers) {
      return this.campaignFrontService.getAnswerCampaignStat(this._answers, type, searchKey);
    }
  }


  getAuthorizedActions(level: number): boolean {
    const adminLevel = this.authService.adminLevel;
    return adminLevel > level;
  }


  importAnswers(file: File, event: Event) {
    event.preventDefault();

    this.answerService.importAsCsv(this._campaign._id, file).subscribe(() => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ANSWER.IMPORTED');
      this.loadAnswers();
      }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  exportAnswers(event: Event) {
    event.preventDefault();
    this.answerService.exportAsCsvByCampaign(this._campaign._id, false);
  }


  private loadTable() {
    if (this._answers) {
      this._actions = ['ANSWER.VALID_ANSWER', 'ANSWER.REJECT_ANSWER'];

      this._tableInfos = {
        _selector: 'admin-answers',
        _content: this._answers,
        _total: this._answers.length,
        _isLocal: true,
        _isFiltrable: true,
        _isSelectable: true,
        _isEditable: true,
        _reloadColumns: true,
        _actions: this._actions,
        _columns: [
          {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
          {_attrs: ['country'], _name: 'TABLE.HEADING.COUNTRY', _type: 'COUNTRY', _isSortable: false},
          {_attrs: ['professional.email'], _name: 'TABLE.HEADING.EMAIL_ADDRESS', _type: 'TEXT'},
          {_attrs: ['professional.jobTitle'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT'},
          {_attrs: ['status'], _name: 'TABLE.HEADING.STATUS', _type: 'MULTI-CHOICES', _choices: [
              {_name: 'VALIDATED', _alias: 'TABLE.STATUS.VALIDATED', _class: 'label label-success'},
              {_name: 'VALIDATED_NO_MAIL', _alias: 'TABLE.STATUS.VALIDATED_NO_MAIL', _class: 'label label-success'},
              {_name: 'SUBMITTED', _alias: 'TABLE.STATUS.SUBMITTED', _class: 'label label-progress'},
              {_name: 'REJECTED', _alias: 'TABLE.STATUS.REJECTED', _class: 'label label-alert'},
              {_name: 'REJECTED_GMAIL', _alias: 'TABLE.STATUS.REJECTED_GMAIL', _class: 'label label-alert'},
              {_name: 'VALIDATED_UMIBOT', _alias: 'TABLE.STATUS.VALIDATED_UMIBOT', _class: 'label label-progress'},
              {_name: 'REJECTED_UMIBOT', _alias: 'TABLE.STATUS.REJECTED_UMIBOT', _class: 'label label-progress'}
            ]},
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
    switch (this._actions.findIndex(value => action._action === value)) {
      case 0: {
        this.updateStatus(action._rows, 'VALIDATED_NO_MAIL');
        break;
      } case 1: {
        this.updateStatus(action._rows, 'REJECTED');
      }
    }
  }


  private updateStatus(rows: Answer[], status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED_NO_MAIL'
    | 'VALIDATED' | 'VALIDATED_UMIBOT' | 'REJECTED_UMIBOT') {
    rows.forEach((row: Answer) => {
      row.status = status;
      this.answerService.save(row._id, row).subscribe(() => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ANSWER.STATUS_UPDATE');
        this.loadAnswers();
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });
    });
  }


  updateAnswer(value: boolean) {
    this.loadAnswers();
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

  get actions(): string[] {
    return this._actions;
  }

  get config(): { search: {}; offset: number; limit: number; sort: { created: number }; fields: string } {
    return this._config;
  }

  get noResult(): boolean {
    return this._noResult;
  }

}
