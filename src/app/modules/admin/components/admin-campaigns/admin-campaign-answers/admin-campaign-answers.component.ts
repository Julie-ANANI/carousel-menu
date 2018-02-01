import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { CampaignService } from '../../../../../services/campaign/campaign.service';

@Component({
  selector: 'app-admin-campaign-answers',
  templateUrl: './admin-campaign-answers.component.html',
  styleUrls: ['./admin-campaign-answers.component.scss']
})
export class AdminCampaignAnswersComponent implements OnInit {

  private _campaign: any;
  private _answers = [];
  private _validatedAnswers = [];
  private _submittedAnswers = [];
  private _toCompleteAnswers = [];
  private _draftAnswers = [];
  private _rejectedAnswers = [];
  private _total = 0;
  private _questions = [];
  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: any;

  constructor(private _activatedRoute: ActivatedRoute,
              private _titleService: TranslateTitleService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.data['campaign'];
    this.loadAnswers();
    this._modalAnswer = null;
    if (this._campaign.innovation.preset && Array.isArray(this._campaign.innovation.preset.sections)) {
      this._campaign.innovation.preset.sections.forEach(section => {
        this._questions = this._questions.concat(section.questions);
      });
    }
  }

  loadAnswers(): void {
    this._campaignService.getAnswers(this._campaign._id).subscribe(result => {
      this._answers = result.answers.localAnswers;
      this._total = this._answers.length + result.answers.draftAnswers.length;
      this._validatedAnswers = this.filterByStatus('VALIDATED');
      this._submittedAnswers = this.filterByStatus('SUBMITTED');
      this._toCompleteAnswers = this.filterByStatus('TO_COMPLETE');
      this._draftAnswers = result.answers.draftAnswers;
      this._rejectedAnswers = this.filterByStatus('REJECTED');
    });
  }

  public filterByStatus(status) {
    return this._answers.filter(answer => answer.status === status);
  }

  public seeAnswer(answer: any) {
    this._modalAnswer = answer;
  }

  get questions(): any[] { return this._questions; }
  get modalAnswer(): any { return this._modalAnswer; }
  set modalAnswer(modalAnswer: any) { this._modalAnswer = modalAnswer; }
  get total(): number { return this._total; }
  get campaign(): any { return this._campaign; }
  get validatedAnswers(): any[] { return this._validatedAnswers; }
  get submittedAnswers(): any[] { return this._submittedAnswers; }
  get toCompleteAnswers(): any[] { return this._toCompleteAnswers; }
  get draftAnswers(): any[] { return this._draftAnswers; }
  get rejectedAnswers(): any[] { return this._rejectedAnswers; }
}
