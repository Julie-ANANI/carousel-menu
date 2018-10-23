import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnswerService } from '../../../../../services/answer/answer.service';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Answer } from '../../../../../models/answer';
import { Campaign } from '../../../../../models/campaign';
import { Question } from '../../../../../models/question';
import { Section } from '../../../../../models/section';
import { AuthService } from '../../../../../services/auth/auth.service';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import {Template} from '../../../../sidebar/interfaces/template';

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
  private _modalAnswer: Answer;
  editMode = new Subject<boolean>();
  sidebarTemplateValue: Template = {};

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private answerService: AnswerService,
              private notificationService: TranslateNotificationsService,
              private _authService: AuthService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this.loadAnswers();
    this._modalAnswer = null;
    if (this._campaign.innovation.preset && Array.isArray(this._campaign.innovation.preset.sections)) {
      this._campaign.innovation.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions || []);
      });
    }
  }

  loadAnswers(): void {
    this._campaignService.getAnswers(this._campaign._id).pipe(first()).subscribe((result: {answers: {localAnswers: Array<Answer>, draftAnswers: Array<Answer>}}) => {
      this._answers = result.answers.localAnswers;
    });
  }

  public autorizedActions(level: number): boolean {
    const adminLevel = this._authService.adminLevel;
    return adminLevel > level;
  }

  public adminMode(): boolean {
    return this._authService.adminLevel > 2;
  }

  public seeAnswer(answer: Answer) {
    this._modalAnswer = answer;

    this.sidebarTemplateValue = {
      animate_state: this.sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'COMMON.EDIT_INSIGHT',
      size: '726px'
    };

  }

  public exportAnswers(event: Event) {
    event.preventDefault();
    this.answerService.exportAsCsv(this._campaign._id, false);
  }

  public importAnswers(file: File, event: Event) {
    event.preventDefault();
    this.answerService.importAsCsv(this._campaign._id, file)
      .subscribe((res: any) => {
        this.notificationService.success('ERROR.SUCCESS', res.message);
        this.loadAnswers();
      }, (err: any) => {
        this.notificationService.error('ERROR.ERROR', err.message);
      });
  }

  public changeStatus(rows: Answer[], status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED_NO_MAIL' | 'VALIDATED') {
    rows.forEach(value => {
      value.status = status;
      this.answerService.save(value._id, value).pipe(first()).subscribe((_res: any) => {
        this.loadAnswers();
      });
    });
  }

  public closeSidebar(state: string) {
    this.sidebarTemplateValue.animate_state = state;
    this.editMode.next(false);
  }

  get questions() { return this._questions; }
  get modalAnswer() { return this._modalAnswer; }
  set modalAnswer(modalAnswer: Answer) { this._modalAnswer = modalAnswer; }
  get total() { return this._total; }
  get campaign() { return this._campaign; }
  get answers() { return this._answers; }
}
