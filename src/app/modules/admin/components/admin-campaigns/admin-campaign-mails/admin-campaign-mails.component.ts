import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { environment } from '../../../../../../environments/environment';
import { CampaignService } from '../../../../../services/campaign/campaign.service';

@Component({
  selector: 'app-admin-campaign-mails',
  templateUrl: './admin-campaign-mails.component.html',
  styleUrls: ['./admin-campaign-mails.component.scss']
})
export class AdminCampaignMailsComponent implements OnInit {

  private _campaign: Campaign;
  private _quizLinks: Array<string> = [];
  private _stats: any = {};
  public mailsToSend: number = 0;
  public firstMail: number = 0;
  public secondMail: number = 0;
  public lastMail: number = 0;
  public batchModal: boolean = false;
  public batch: any = {};
  public dateformat: string = "le dd/MM/yyyy à hh:mm"

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    if (this._campaign.innovation && this._campaign.innovation.quizId) {
      this._quizLinks = ['fr', 'en'].map((l) => {
        return environment.quizUrl + '/quiz/' + this._campaign.innovation.quizId + '/' + this._campaign._id + '?lang=' + l;
      });
    }
    this._campaignService.messagesStats(this._campaign._id).first().subscribe((stats: any) => {
      this._stats = stats;
      this.lastMail = this._stats['CAMPAIGN_LAST'] || 0;
      this.secondMail = this._stats['CAMPAIGN_SECOND'] || 0;
      this.firstMail = this._stats['CAMPAIGN_FIRST'] || 0;
      if (this._campaign.stats && this._campaign.stats.campaign) {
        this.mailsToSend = (this._campaign.stats.campaign.nbFirstTierMails || 0) - this.firstMail;
      } else {
        this.mailsToSend = 0;
      }
    });

    this.batch = {
      campaign: this._campaign._id,
      size: 0
    }
  }

  public createNewBatch() {
    // On calcule la date d'envoi 'firstMail' à partir des inputs de la date et heure
    this.batch.firstMail = new Date(this.batch.date);
    const hours = parseInt(this.batch.time.split(':')[0]);
    const minutes = parseInt(this.batch.time.split(':')[1]);
    this.batch.firstMail.setHours(hours);
    this.batch.firstMail.setMinutes(minutes);
     this._campaignService.createNewBatch(this._campaign._id, this.batch).first().subscribe((batch: any) => {
      this.stats.batches.push(batch);
    });
  }

  get campaign() { return this._campaign }
  get quizLinks() {return this._quizLinks }
  get stats() {return this._stats }

}
