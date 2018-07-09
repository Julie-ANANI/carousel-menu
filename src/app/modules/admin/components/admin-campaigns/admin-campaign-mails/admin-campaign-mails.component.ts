import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { environment } from '../../../../../../environments/environment';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import {Batch} from '../../../../../models/batch';
import {Table} from '../../../../shared/components/shared-table/models/table';
import {Template} from '../../../../shared/components/shared-sidebar/interfaces/template';

@Component({
  selector: 'app-admin-campaign-mails',
  templateUrl: './admin-campaign-mails.component.html',
  styleUrls: ['./admin-campaign-mails.component.scss']
})
export class AdminCampaignMailsComponent implements OnInit {

  private _campaign: Campaign;
  private _quizLinks: Array<string> = [];
  private _stats: any = {};
  public mailsToSend = 0;
  public firstMail = 0;
  public secondMail = 0;
  public lastMail = 0;
  public testModal= false;
  public batchModal = false;
  public newBatch: Batch;
  public dateformat = 'le dd/MM/yyyy à HH:mm';
  public selectedBatchToBeDeleted: any = null;
  public editDates: Array<any>;
  public dateMail: string;
  public timeMail: string;

  private _tableBatch: Array<any> = [];

  public config: any = {
    sort: {},
    search: {}
  };

  public templateSidebar: Template = {};
  public currentBatch = {};
  public content = {};
  public currentRow = {};

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

      this._stats.batches.forEach( (batch: any) => {
        this._tableBatch.push(
          this.generateTableBatch(batch)
        );
      });


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
          this._tableBatch = this.stats.batches.map((batch: any) => {
            return this.generateTableBatch(batch);
          });
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
       this._tableBatch = this.stats.batches.map((batch: any) => {
         return this.generateTableBatch(batch);
       });
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

  public getWorkflowName(index: number) {
    if (this.campaign.settings.ABsettings.status != 0) {
      if (index == 0) {
        return this.campaign.settings.ABsettings.nameWorkflowA;
      }
      if (index == 1) {
        return this.campaign.settings.ABsettings.nameWorkflowB;
      }
    }
    return this.campaign.settings.defaultWorkflow;
  }



  public generateTableBatch(batch: Batch): Table {
    // console.log('generate ' + batch._id);
    const firstJSdate = new Date(batch.firstMail);
    const firstTime = firstJSdate.getHours() + ':' + firstJSdate.getMinutes();

    const secondJSdate = new Date(batch.secondMail);
    const secondTime = secondJSdate.getHours() + ':' + secondJSdate.getMinutes();

    const thirdJSdate = new Date(batch.thirdMail);
    const thirdTime = thirdJSdate.getHours() + ':' + thirdJSdate.getMinutes();

    const index = this._getBatchIndex(batch._id);

    const workflowname = this.getWorkflowName(index);

    const digit = 2;
    if (!batch.predictions || batch.predictions.length === 0) {
      const reset = {opened: 0, clicked: 0, insights: 0};
      batch.predictions = [reset, reset, reset];
    }
    const t: Table = {
      _selector: 'TODO',
      _title: workflowname,
      _isNotPaginable: true,
      _isHeadable: true,
      _isEditable: true,
      _content: [
        {
          Step: '01 - HelloWorld',
          Sent: batch.stats[0].delivered + batch.stats[0].bounced,
          OpenedPred: ((batch.predictions[0].opened  * 100).toFixed(digit) + '%'  || ''),
          OpenedReel: ((batch.stats[0].opened / batch.size) * 100).toFixed(digit) + '%',
          ClickedPred: ((batch.predictions[0].clicked * 100).toFixed(digit) + '%'  || ''),
          ClickedReel: ((batch.stats[0].clicked / batch.size) * 100).toFixed(digit) + '%',
          InsightsPred: batch.predictions[0].insights,
          InsightsReel: batch.stats[0].insights,
          Date: batch.firstMail,
          Time: firstTime,
          Status: this.getStatus(0, batch.status)
        }, {
          Step: '02 - 2nd try',
          Sent: batch.stats[1].delivered + batch.stats[1].bounced,
          OpenedPred: ((batch.predictions[1].opened  * 100).toFixed(digit) + '%'  || ''),
          OpenedReel: ((batch.stats[1].opened / batch.size) * 100).toFixed(digit) + '%',
          ClickedPred: ((batch.predictions[1].clicked * 100).toFixed(digit) + '%'  || ''),
          ClickedReel: ((batch.stats[1].clicked / batch.size) * 100).toFixed(digit) + '%',
          InsightsPred: batch.predictions[1].insights,
          InsightsReel: batch.stats[1].insights,
          Date: batch.secondMail,
          Time: secondTime,
          Status: this.getStatus(1, batch.status)
        }, {
          Step: '03 - 3rd try',
          Sent: batch.stats[2].delivered + batch.stats[2].bounced,
          OpenedPred: ((batch.predictions[2].opened  * 100).toFixed(digit) + '%' || ''),
          OpenedReel: ((batch.stats[2].opened / batch.size) * 100).toFixed(digit) + '%',
          ClickedPred: ((batch.predictions[2].clicked * 100).toFixed(digit) + '%'  || ''),
          ClickedReel: ((batch.stats[2].clicked / batch.size) * 100).toFixed(digit) + '%',
          InsightsPred: batch.predictions[2].insights,
          InsightsReel: batch.stats[2].insights,
          Date: batch.thirdMail,
          Time: thirdTime,
          Status: this.getStatus(2, batch.status)
        }, {
          Step: '04 - Thanks',
          Sent: batch.stats[3].delivered + batch.stats[3].bounced,
          OpenedPred: '',
          OpenedReel: ((batch.stats[3].opened / batch.size) * 100).toFixed(digit) + '%',
          ClickedPred: '',
          ClickedReel: ((batch.stats[3].clicked / batch.size) * 100).toFixed(digit) + '%',
          InsightsPred: '',
          InsightsReel: '',
          Date: '',
          Time: '',
          Status: ''
        }],
      _total: null,
      _columns: [{
        _attrs: ['Step'],
        _name: 'Step',
        _type: 'TEXT',
        _isSortable: false
      }, {
        _attrs: ['Sent'],
        _name: 'Sent',
        _type: 'TEXT',
        _isSortable: false
      }, {
        _attrs: ['OpenedPred', 'OpenedReel'],
        _name: 'Opened',
        _type: 'MULTI-LABEL', _multiLabels: [ {_attr: 'OpenedReel', _class: 'label-validate'}, {_attr: 'OpenedPred', _class: 'label-draft'} ],
        _isSortable: false
      }, {
        _attrs: ['ClickedPred', 'ClickedReel'],
        _name: 'Clicked',
        _type: 'MULTI-LABEL', _multiLabels: [ {_attr: 'ClickedReel', _class: 'label-validate'}, {_attr: 'ClickedPred', _class: 'label-draft'} ],
        _isSortable: false
      }, {
        _attrs: ['InsightsPred', 'InsightsReel'],
        _name: 'Insights',
        _type: 'MULTI-LABEL', _multiLabels: [ {_attr: 'InsightsReel', _class: 'label-validate'} , {_attr: 'InsightsPred', _class: 'label-draft'}],
        _isSortable: false
      }, {
        _attrs: ['Date'],
        _name: 'Date',
        _type: 'DATE',
        _isSortable: false
      }, {
        _attrs: ['Time'],
        _name: 'Time',
        _type: 'TEXT',
        _isSortable: false
      }, {
        _attrs: ['Status'], _name: 'Status', _type: 'MULTI-CHOICES',
        _isSortable: false,
        _choices: [
          {_name: 'Sent', _class: 'label-progress'},
          {_name: 'Planned',  _class: 'label-validate'},
        ]}]
    };
    return t;
  }


  get innoReady() {
    return (
      this._campaign.innovation.status === 'EVALUATING'
    );
  }

  closeSidebar(value: string) {
    this.templateSidebar.animate_state = value;
  }

  editBatch(row: any, batch: Batch) {
    let step;
    switch (row.Step) {
      case ('01 - HelloWorld') :
        step = 'FIRST';
        break;
      case ('02 - 2nd try')  :
        step = 'SECOND';
        break;
      case ('03 - 3rd try') :
        step = 'THIRD';
        break;
      case ('04 - Thanks') :
        step = 'THANKS';
        break;
    }
    this.content = this.getContentWorkflowStep(batch._id, step);
    this.currentRow = row;
    this.currentBatch = batch;
    this.templateSidebar = {
      animate_state: 'active',
      title: 'COMMON.EDIT',
      type: 'editBatch'
    };
  }

  public getContentWorkflowStep(batchID: any, step: any): any {
    const index = this._getBatchIndex(batchID);
    const workflowname = this.getWorkflowName(index);
    const content = {en: '', fr: ''}
    this.campaign.settings.emails.forEach( mail => {
      if (mail.step === step && workflowname === mail.nameWorkflow) {
       if (mail.language == 'en') {
         content.en = mail.content;
       } else {
         content.fr = mail.content;
       }
      }
    });
    return content;
  }

  onSubmitEditBatch(batch: Batch) {
    this._campaignService.updateBatch(batch).first().subscribe( batch => {
      //virer la sideBar
      //Afficher le bon batch dans les batch de stats :)
    });
  }


  get statusAB() { return this._campaign.settings.ABsettings.status }
  get defaultWorkflow() { return  this._campaign.settings.defaultWorkflow }
  get quizGenerated() { return (this._campaign && this._campaign.innovation && this._campaign.innovation.quizId !== ""); }
  get campaign() { return this._campaign }
  get quizLinks() {return this._quizLinks }
  get stats() {return this._stats }

  public tableBatch(index: number) { return this._tableBatch[index] }

}
