import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { QuizService } from '../../../../../../services/quiz/quiz.service';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';

@Component({
  selector: 'app-admin-campaign-quiz',
  templateUrl: './admin-campaign-quiz.component.html',
  styleUrls: ['./admin-campaign-quiz.component.scss']
})

export class AdminCampaignQuizComponent implements OnInit {

  private _campaign: Campaign;

  private _quizLinks: Array<string> = [];

  private _noResult = false;

  constructor(private activatedRoute: ActivatedRoute,
              private campaignFrontService: CampaignFrontService) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];

    if (this._campaign && this._campaign.innovation && this._campaign.innovation.quizId) {
      this._quizLinks = ['fr', 'en'].map((l) => {
        return QuizService.getQuizUrl(this._campaign, l);
      });
    }

    if (this._quizLinks.length === 0) {
      this._noResult = true;
    }

  }


  getCampaignStat(searchKey: string): number {
    if (this._campaign) {
      return this.campaignFrontService.getProsCampaignStat(this._campaign, searchKey);
    }
  }

  get campaign() {
    return this._campaign
  }

  get quizLinks() {
    return this._quizLinks
  }

  get noResult(): boolean {
    return this._noResult;
  }

}
