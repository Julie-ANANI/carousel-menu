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
  public newBatch: any = {};
  public dateformat: string = "le dd/MM/yyyy à hh:mm";
  public selectedBatchIdToBeDeleted: string = null;
  public editDates: Array<any>;

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

    this.newBatch = {
      campaign: this._campaign._id,
      size: 0
    }
  }

  public createNewBatch() {
    this.newBatch.firstMail = this._computeDate(this.newBatch.date, this.newBatch.time);
    this._campaignService.createNewBatch(this._campaign._id, this.newBatch).first().subscribe((batch: any) => {
      this.stats.batches.push(batch);
    });
  }

  public startEditing(batch: any) {
    this.editDates = [
      {
        date: batch.firstMail.toString().slice(0, 10),
        time: batch.firstMail.toString().slice(11, 16)
      },
      {
        date: batch.secondMail.toString().slice(0, 10),
        time: batch.secondMail.toString().slice(11, 16)
      },
      {
        date: batch.thirdMail.toString().slice(0, 10),
        time: batch.thirdMail.toString().slice(11, 16)
      }
    ];
    this.stats.batches[this._getBatchIndex(batch._id)]['editing'] = true;

  }

  public updateBatch(batch: any) {
    this.stats.batches[this._getBatchIndex(batch._id)]['editing'] = false;
    this._campaignService.updateBatch(batch).first().subscribe((batch: any) => {
      this.stats.batches[this._getBatchIndex(batch._id)] = batch;
    });
  }

  public deleteBatch(batchId: string) {
     this._campaignService.deleteBatch(batchId).first().subscribe(_ => {
       this.stats.batches.splice(this._getBatchIndex(batchId), 1);
       this.selectedBatchIdToBeDeleted = null;
    });
  }

  private _getBatchIndex(batchId: string): number {
    for (const batch of this.stats.batches) {
      if (batchId === batch._id) {
        return this.stats.batches.indexOf(batch);
      }
    }
  }

  private _computeDate(date: string, time: string) {
    // Calcule d'une date d'envoi à partir des inputs de la date et heure
    let computedDate = new Date(date);
    const hours = parseInt(time.split(':')[0]);
    const minutes = parseInt(time.split(':')[1]);
    computedDate.setHours(hours);
    computedDate.setMinutes(minutes);
    return computedDate;
  }

  get campaign() { return this._campaign }
  get quizLinks() {return this._quizLinks }
  get stats() {return this._stats }

}
