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
import { first } from 'rxjs/operators';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';

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

  constructor(private activatedRoute: ActivatedRoute,
              private campaignService: CampaignService,
              private answerService: AnswerService,
              private translateNotificationsService: TranslateNotificationsService,
              private authService: AuthService) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];
    this._adminMode = this.authService.adminLevel > 2;
    this.loadAnswers();

    if (this._campaign.innovation.preset && Array.isArray(this._campaign.innovation.preset.sections)) {
      this._campaign.innovation.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions || []);
      });

    }
  }


  private loadAnswers() {
    this.campaignService.getAnswers(this._campaign._id).pipe(first()).subscribe((result: { answers: { localAnswers: Array<Answer>, draftAnswers: Array<Answer> } }) => {
      this._answers = result.answers.localAnswers;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  getAuthorizedActions(level: number): boolean {
    const adminLevel = this.authService.adminLevel;
    return adminLevel > level;
  }


  importAnswers(file: File, event: Event) {
    event.preventDefault();

    this.answerService.importAsCsv(this._campaign._id, file).pipe(first()).subscribe(() => {
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


  seeAnswer(answer: Answer) {
    this._modalAnswer = answer;

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'COMMON.EDIT_INSIGHT',
      size: '726px'
    };

  }

  changeStatus(rows: Answer[], status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED_NO_MAIL' | 'VALIDATED') {
    rows.forEach(value => {
      value.status = status;
      this.answerService.save(value._id, value).pipe(first()).subscribe(() => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ANSWER.STATUS_UPDATE');
        this.loadAnswers();
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });
    });
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

}
