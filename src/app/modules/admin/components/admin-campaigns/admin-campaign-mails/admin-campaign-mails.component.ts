import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { environment } from '../../../../../../environments/environment';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import {Batch} from '../../../../../models/batch';
import {Table} from '../../../../shared/components/shared-table/models/table';

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
  public testModal: boolean = false;
  public batchModal: boolean = false;
  public newBatch: Batch;
  public dateformat: string = "le dd/MM/yyyy à HH:mm";
  public selectedBatchToBeDeleted: any = null;
  public editDates: Array<any>;
  public dateMail: string;
  public timeMail: string;

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _notificationsService: TranslateNotificationsService) { }

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
      campaign: this._campaign,
      size: 0,
      active: true
    };
  }

  private getStatus(step: number, status: number): string {
    if (status > step) {
      return 'Sent';
    } else {
      return 'Planned';
    }

  }

  public createNewBatch(sendNow: boolean) {
    this.newBatch.firstMail = sendNow ? Date.now() : this._computeDate(this.dateMail, this.timeMail);
    this.newBatch.sendNow = sendNow;
    this._campaignService.createNewBatch(this._campaign._id, this.newBatch).first().subscribe((batch: Batch) => {
      this.stats.batches.push(batch);
    });
  }

  public freezeStatus(batch: Batch) {
    this._campaignService.freezeStatus(batch).first().subscribe(modifiedBatch => {
      this.stats.batches[this._getBatchIndex(modifiedBatch._id)] = modifiedBatch;
    });
  }

  // result won't be typed as batch everytime
  public AutoBatch() {
    this._campaignService.AutoBatch(this._campaign._id).first().subscribe((result: Array<any>) => {
      if (result.length === 0) {
        this._notificationsService.success('Autobatch OFF', 'No batch will be created');
      } else {
        if (result[0] !== 0) {
          this.stats.batches = result;
        }
        this._notificationsService.success('Autobatch ON', 'Every pro in campaign just get batched');
      }
    });
  }

// DEBUG AUTOBATCH => Creation de pro a la volée
  public creerpro() {
    this._campaignService.creerpro(this._campaign._id).first().subscribe();
  }

  public startEditing(batch: Batch) {
    const getDate = (d: string) => d.toString().slice(0,10);
    const getTime = (d: string) => (new Date(d)).toLocaleTimeString();
    this.editDates = [
      {
        date: getDate(batch.firstMail),
        time: getTime(batch.firstMail)
      },
      {
        date: getDate(batch.secondMail),
        time: getTime(batch.secondMail)
      },
      {
        date: getDate(batch.thirdMail),
        time: getTime(batch.thirdMail)
      }
    ];
    this.stats.batches[this._getBatchIndex(batch._id)]['editing'] = true;

  }

  public updateBatch(batch: Batch) {
    this.stats.batches[this._getBatchIndex(batch._id)]['editing'] = false;
    batch.firstMail = this._computeDate(this.editDates[0].date, this.editDates[0].time);
    batch.secondMail = this._computeDate(this.editDates[1].date, this.editDates[1].time);
    batch.thirdMail = this._computeDate(this.editDates[2].date, this.editDates[2].time);
    delete batch.status;
    this._campaignService.updateBatch(batch).first().subscribe((Abatch: Batch) => {
      this.stats.batches[this._getBatchIndex(Abatch._id)] = Abatch;
    });
  }

  public deleteBatch(batchId: string) {
     this._campaignService.deleteBatch(batchId).first().subscribe(_ => {
       this.stats.batches.splice(this._getBatchIndex(batchId), 1);
       this.selectedBatchToBeDeleted = null;
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

  public sendTestEmails(batchStatus: number) {
    this._campaignService.sendTestEmails(this._campaign._id, batchStatus).first().subscribe(_ => {
      console.log("OK");
    });
  }

  public removeOK(batch: Batch) {
    if (batch.status === 0) {
      this.selectedBatchToBeDeleted = batch;
    }
  }

  get readyAutoBatch() {
    return (
      this.quizGenerated &&
      this.innoReady &&
      this.templateImported &&
      this.defaultWorkflow &&
      (this.statusAB != 1)
    );
  }

  get templateImported(): boolean {
    return (
      this._campaign.settings.emails.length !== 0
    );
  }


  public generateTableBatch(batch: Batch): Table {
    const firstJSdate = new Date(batch.firstMail);
    const firstTime = firstJSdate.getHours() + ':' + firstJSdate.getMinutes();

    const secondJSdate = new Date(batch.secondMail);
    const secondTime = secondJSdate.getHours() + ':' + secondJSdate.getMinutes();

    const thirdJSdate = new Date(batch.thirdMail);
    const thirdTime = batch.thirdMail.getHours() + ':' + thirdJSdate.getMinutes();

    const t: Table = {
      _selector: 'TODO',
      _title: this._campaign.settings.defaultWorkflow || "A/B",
      _isNotPaginable: true,
      _content: [
        {
          Step: '01 - HelloWorld',
          Sent: batch.stats[0].delivered + batch.stats[0].bounced,
          Opened: (batch.stats[0].opened / batch.size) * 100 + '%',
          Clicked: (batch.stats[0].clicked / batch.size) * 100 + '%',
          Insights: batch.stats[0].insights,
          Date: batch.firstMail,
          Time: firstTime,
          Status: this.getStatus(0, batch.status)
        }, {
          Step: '02 - 2nd try',
          Sent: batch.stats[1].delivered + batch.stats[1].bounced,
          Opened: (batch.stats[1].opened / batch.size) * 100 + '%',
          Clicked: (batch.stats[1].clicked / batch.size) * 100 + '%',
          Insights: batch.stats[1].insights,
          Date: batch.secondMail,
          Time: secondTime,
          Status: this.getStatus(1, batch.status)
        }, {
          Step: '03 - 3rd try',
          Sent: batch.stats[2].delivered + batch.stats[2].bounced,
          Opened: (batch.stats[2].opened / batch.size) * 100 + '%',
          Clicked: (batch.stats[2].clicked / batch.size) * 100 + '%',
          Insights: batch.stats[2].insights,
          Date: batch.thirdMail,
          Time: thirdTime,
          Status: this.getStatus(2, batch.status)
        }, { //TODO: backend (undefined)
          Step: '04 - Thanks',
          Sent: batch.stats[3].delivered + batch.stats[3].bounced,
          Opened: (batch.stats[3].opened / batch.size) * 100 + '%',
          Clicked: (batch.stats[3].clicked / batch.size) * 100 + '%',
          Insights: '',
          Date: '',
          Time: '',
          Status: ''
        }],
      _total: null,
      _columns: [{
        _attr: 'Step',
        _name: 'Step',
        _type: 'TEXT'
      }, {
        _attr: 'Sent',
        _name: 'Sent',
        _type: 'TEXT'
      }, {
        _attr: 'Opened',
        _name: 'Opened',
        _type: 'TEXT'
      }, {
        _attr: 'Clicked',
        _name: 'Clicked',
        _type: 'TEXT'
      }, {
        _attr: 'Insights',
        _name: 'Insights',
        _type: 'TEXT'
      }, {
        _attr: 'Date',
        _name: 'Date',
        _type: 'DATE'
      }, {
        _attr: 'Time',
        _name: 'Time',
        _type: 'TEXT'
      }, {
        _attr: 'Status',
        _name: 'Status',
        _type: 'TEXT'
      }]
    };
    return t;
  }



  get innoReady() {
    return (
      this._campaign.innovation.status === 'EVALUATING'
    );
  }

  get statusAB() { return this._campaign.settings.ABsettings.status }
  get defaultWorkflow() { return  this._campaign.settings.defaultWorkflow }
  get quizGenerated() { return (this._campaign && this._campaign.innovation && this._campaign.innovation.quizId !== ""); }
  get campaign() { return this._campaign }
  get quizLinks() {return this._quizLinks }
  get stats() {return this._stats }

}
