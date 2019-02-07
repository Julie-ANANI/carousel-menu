import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { QuizService } from '../../../../../../services/quiz/quiz.service';

@Component({
  selector: 'app-admin-campaign-quiz',
  templateUrl: './admin-campaign-quiz.component.html',
  styleUrls: ['./admin-campaign-quiz.component.scss']
})

export class AdminCampaignQuizComponent implements OnInit {

  private _campaign: Campaign;

  private _quizLinks: Array<string> = [];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];

    if (this._campaign.innovation && this._campaign.innovation.quizId) {
      this._quizLinks = ['fr', 'en'].map((l) => {
        return QuizService.getQuizUrl(this._campaign, l);
      });
    }

  }


  getCampaignStat(searchKey: string): number {
    let value = 0;

    switch (searchKey) {

      case 'professional':
        value = this._campaign.stats.nbPros;
        break;

      case 'notReached':
        value = Math.round(((this._campaign.stats.nbPros - this._campaign.stats.nbProsSent) / this._campaign.stats.nbPros) * 100);
        break;

      case 'good':
        value = Math.round((this._campaign.stats.campaign.nbFirstTierMails / this._campaign.stats.nbPros) * 100);
        break;

      case 'unsure':
        value = Math.round((this._campaign.stats.campaign.nbSecondTierMails / this._campaign.stats.nbPros) * 100);
        break;

      case 'bad':
        value = Math.round(((this._campaign.stats.nbPros - (this._campaign.stats.campaign.nbFirstTierMails + this._campaign.stats.campaign.nbSecondTierMails ))/ this._campaign.stats.nbPros) * 100);
        break;

      default:
        // do nothing...

    }

    return isNaN(value) ? 0 : value;
  }

  get campaign() {
    return this._campaign
  }

  get quizLinks() {
    return this._quizLinks
  }

}
