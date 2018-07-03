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

@Component({
  selector: 'app-admin-campaign-answers',
  templateUrl: './admin-campaign-answers.component.html',
  styleUrls: ['./admin-campaign-answers.component.scss']
})
export class AdminCampaignAnswersComponent implements OnInit {

  private _campaign: Campaign;
  private _answers: Array<Answer> = [];
  private _validatedAnswers: Array<Answer> = [];
  private _submittedAnswers: Array<Answer> = [];
  private _toCompleteAnswers: Array<Answer> = [];
  private _draftAnswers: Array<Answer> = [];
  private _rejectedAnswers: Array<Answer> = [];
  private _total = 0;
  private _questions: Array<Question> = [];
  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: Answer;

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
    this._campaignService.getAnswers(this._campaign._id).first().subscribe((result: {answers: {localAnswers: Array<Answer>, draftAnswers: Array<Answer>}}) => {
      this._answers = result.answers.localAnswers;
      this._total = this._answers.length + result.answers.draftAnswers.length;
      this._validatedAnswers = this.filterByStatus('VALIDATED');
      this._submittedAnswers = this.filterByStatus('SUBMITTED');
      this._toCompleteAnswers = this.filterByStatus('TO_COMPLETE');
      this._draftAnswers = result.answers.draftAnswers;
      this._rejectedAnswers = this.filterByStatus('REJECTED');
    });
  }

  public autorizedActions(level: number): boolean {
    const adminLevel = this._authService.adminLevel;
    return adminLevel > level;
  }

  public filterByStatus(status: 'DRAFT' | 'SUBMITTED' | 'TO_COMPLETE' | 'REJECTED' | 'VALIDATED') {
    return this._answers.filter(answer => answer.status === status);
  }

  public seeAnswer(answer: Answer) {
    this._modalAnswer = answer;
  }

  public exportAnswers(event: Event) {
    event.preventDefault();
    this.answerService.exportAsCsv(this._campaign._id);
  }

  public importAnswers(file: File, event: Event) {
    event.preventDefault();
    this.answerService.importAsCsv(this._campaign._id, file)
      .subscribe((res) => {
        this.notificationService.success('ERROR.SUCCESS', res.message);
        this.loadAnswers();
      }, (err) => {
        this.notificationService.error('ERROR.ERROR', err.message);
      });
  }

  get questions() { return this._questions; }
  get modalAnswer() { return this._modalAnswer; }
  set modalAnswer(modalAnswer: Answer) { this._modalAnswer = modalAnswer; }
  get total() { return this._total; }
  get campaign() { return this._campaign; }
  get validatedAnswers() { return this._validatedAnswers; }
  get submittedAnswers() { return this._submittedAnswers; }
  get toCompleteAnswers() { return this._toCompleteAnswers; }
  get draftAnswers() { return this._draftAnswers; }
  get rejectedAnswers() { return this._rejectedAnswers; }
}
