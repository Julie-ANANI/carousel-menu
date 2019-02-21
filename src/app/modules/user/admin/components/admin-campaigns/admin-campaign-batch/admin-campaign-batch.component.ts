import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { environment } from '../../../../../../../environments/environment';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Batch } from '../../../../../../models/batch';
import { Table } from '../../../../../table/models/table';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-campaign-batch',
  templateUrl: './admin-campaign-batch.component.html',
  styleUrls: ['./admin-campaign-batch.component.scss']
})

export class AdminCampaignBatchComponent implements OnInit {

  private _campaign: Campaign;

  private _quizLinks: Array<string> = [];

  private _stats: any = {};

  // Math: any = Math;

  // mailsToSend = 0;

  // firstMail = 0;

  // secondMail = 0;

  // lastMail = 0;

  // testModal= false;

  // batchModal = false;

  // nuggetsBatch: Batch = null;

  // dateformat = 'le dd/MM/yyyy à HH:mm';

  // dateMail: string;

  // timeMail: string;

  private _tableBatch: Array<any> = [];

  private _config: any = {
    sort: {},
    search: {}
  };

  private _currentBatch: Batch;

  private _content = {};

  private _currentRow = {};

  private _currentStep: number;

  private _noResult = true;

  private _firstAutoBatch = false;

  private _selectedBatchToBeDeleted: Batch = null;

  private _modalDelete = false;

  private _newBatch: Batch;

  private _sidebarValue: SidebarInterface = {};

  constructor(private activatedRoute: ActivatedRoute,
              private campaignService: CampaignService,
              private translateNotificationsService: TranslateNotificationsService,
              private campaignFrontService: CampaignFrontService,
              private translateService: TranslateService) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];
    this.initializeNewBatch();
    this.getQuiz();
    this.getBatches();
  }


  getCampaignStat(searchKey: any): number {
    if (this._campaign) {
      return this.campaignFrontService.getBatchCampaignStat(this._campaign, searchKey);
    }
  }


  private initializeNewBatch() {
    this._newBatch = {
      campaign: this._campaign,
      size: 0,
      active: true
    };
  }


  private getQuiz() {
    if (this._campaign.innovation && this._campaign.innovation.quizId) {
      this._quizLinks = ['fr', 'en'].map((lang) => {
        return environment.quizUrl + '/quiz/' + this._campaign.innovation.quizId + '/' + this._campaign._id + '?lang=' + lang;
      });
    }
  }


  activateSidebar(activate: string) {

    switch (activate) {

      case 'newBatch':
        this._sidebarValue = {
          animate_state: 'active',
          type: 'newBatch',
          title: 'COMMON.SIDEBAR.NEW_BATCH'
        };
        break;

      case 'editBatch':
        this._sidebarValue = {
          animate_state: 'active',
          type: 'editBatch',
          title: 'COMMON.SIDEBAR.EDIT_BATCH',
          size: '726px'
        };
        break;

      default:
        //do nothing...
    }

  }


  onFirstAutoBatch(event: Event) {
    if (event.target['checked']) {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.STARTED');
      this._firstAutoBatch = true;
      this.setNuggets();
    } else {
      this.setAutoBatch();
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.STOPPED');
    }
  }


  /***
   * result won't be typed as batch every-time
   * @param event
   */
  onSwitchAutoBatch(event: Event) {
    if (event.target['checked']) {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.STARTED');
    } else {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.STOPPED');
    }
    this.setAutoBatch();
  }


  OnSwitchNuggets(event: Event) {
    if (event.target['checked']) {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.NUGGETS_ACTIVATED');
    } else {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.NUGGETS_DEACTIVATED');
    }
    this.setNuggets();
  }


  private setNuggets() {
    this.campaignService.setNuggets(this._campaign._id).pipe(first()).subscribe((result: Campaign) => {
      this._campaign = result;
      if (this._firstAutoBatch) {
        this.setAutoBatch();
      }
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CAMPAIGN.BATCH.NUGGETS_ERROR');
    });
  }


  private setAutoBatch() {
    this.campaignService.AutoBatch(this._campaign._id).pipe(first()).subscribe((result: Array<any>) => {
      if (result.length === 0) {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.NOT_CREATED');
      } else {
        if (result[0] !== 0) {
          this._noResult = false;
          this._firstAutoBatch = false;
          this._stats.batches = result;
          this._tableBatch = this._stats.batches.map((batch: any) => {
            return this.generateTableBatch(batch);
          });
        }
      }
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  private getBatches() {
    this.campaignService.messagesStats(this._campaign._id).pipe(first()).subscribe((stats: any) => {
      this._stats = stats;

      // this.lastMail = this._stats['CAMPAIGN_LAST'] || 0;
      // this.secondMail = this._stats['CAMPAIGN_SECOND'] || 0;
      // this.firstMail = this._stats['CAMPAIGN_FIRST'] || 0;

      /*if (this._campaign.stats && this._campaign.stats.campaign) {
        this.mailsToSend = (this._campaign.stats.campaign.nbFirstTierMails || 0) - this.firstMail;
      } else {
        this.mailsToSend = 0;
      }*/

      if (this._stats.batches.length > 0) {
        this._noResult = false;
        this._stats.batches.forEach( (batch: any) => {
          this._tableBatch.push(this.generateTableBatch(batch));
        });
      } else {
        this._noResult = true;
      }

    });
  }


  onOutput(value: any) {

    switch (this._sidebarValue.type) {

      case 'newBatch':
        this.createNewBatch(value);
        break;

      case 'editBatch':
        this.updateBatch(value);
        break;

      default:
      //do nothing...
    }
    
  }


  private createNewBatch(formValue: FormGroup) {
    this._newBatch.size = formValue.value['pros'];
    this._newBatch.firstMail = formValue.value['send'] ? Date.now() : this.computeDate(formValue.value['date'], formValue.value['time']);
    this._newBatch.sendNow = formValue.value['send'];

    this.campaignService.createNewBatch(this._campaign._id, this._newBatch).pipe(first()).subscribe(() => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.STARTED');
      this.getBatches();
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  /***
   * Calcule d'une date d'envoi à partir des inputs de la date et heure
   * @param date
   * @param time
   */
  private computeDate(date: string, time: string) {
    const computedDate = new Date(date);
    const hours = parseInt(time.split(':')[0], 10);
    const minutes = parseInt(time.split(':')[1], 10);
    computedDate.setHours(hours);
    computedDate.setMinutes(minutes);
    return computedDate;
  }


  generateTableBatch(batch: Batch): Table {

    const firstJSdate = new Date(batch.firstMail);
    const firstTime = ('0' + firstJSdate.getHours()).slice(-2) + ':' + ('0' + firstJSdate.getMinutes()).slice(-2);

    const secondJSdate = new Date(batch.secondMail);
    const secondTime = ('0' + secondJSdate.getHours()).slice(-2) + ':' + ('0' + secondJSdate.getMinutes()).slice(-2);

    const thirdJSdate = new Date(batch.thirdMail);
    const thirdTime = ('0' + thirdJSdate.getHours()).slice(-2) + ':' + ('0' + thirdJSdate.getMinutes()).slice(-2);

    const workflowName = ('Workflow' + this.getWorkflowName(this.getBatchIndex(batch._id))).toString();

    const digit = 2; // number of decimals stats/pred

    if (!batch.predictions || batch.predictions.length === 0) {
      const reset = {opened: 0, clicked: 0, insights: 0};
      batch.predictions = [reset, reset, reset];
    }
    const t: any = {
      _selector: batch._id,
      _isNotPaginable: true,
      _isEditable: true,
      _isNoTitle: true,
      _content: [
        {
          Step: '01 - Hello World',
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
      _total: 1,
      _columns: [{
        _attrs: ['Step'],
        _name: workflowName,
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
        _type: 'MULTI-LABEL', _multiLabels: [ {_attr: 'OpenedReel', _class: 'label label-success'}, {_attr: 'OpenedPred', _class: 'label label-meta'} ],
        _isSortable: false
      }, {
        _attrs: ['ClickedPred', 'ClickedReel'],
        _name: 'Clicked',
        _type: 'MULTI-LABEL', _multiLabels: [ {_attr: 'ClickedReel', _class: 'label label-success'}, {_attr: 'ClickedPred', _class: 'label label-meta'} ],
        _isSortable: false
      }, {
        _attrs: ['InsightsPred', 'InsightsReel'],
        _name: 'Insights',
        _type: 'MULTI-LABEL', _multiLabels: [ {_attr: 'InsightsReel', _class: 'label label-success'} , {_attr: 'InsightsPred', _class: 'label label-meta'}],
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
          {_name: 'Sent', _class: 'label label-success'},
          {_name: 'Planned',  _class: 'label label-progress'},
        ]}]
    };

    return t;

  }


  private getBatchIndex(batchId: string): number {
    for (const batch of this.stats.batches) {
      if (batchId === batch._id) {
        return this.stats.batches.indexOf(batch);
      }
    }
  }


  private getWorkflowName(index: number) {
    if (this._campaign.settings.ABsettings.status !== '0') {
      if (index === 0) {
        return this._campaign.settings.ABsettings.nameWorkflowA;
      }
      if (index === 1) {
        return this._campaign.settings.ABsettings.nameWorkflowB;
      }
    }
    return this._campaign.settings.defaultWorkflow;
  }


  private getStatus(step: number, status: number) {
    if (status > step) {
      return 'Sent';
    } else {
      return 'Planned';
    }
  }


  getDeleteStatus(batch: Batch) {
    if (this._campaign.settings.ABsettings.status === '0') {
      return batch.status === 0;
    } else {
      if (batch._id === this._campaign.settings.ABsettings.batchA || batch._id === this._campaign.settings.ABsettings.batchB) {
        return false;
      } else {
        return batch.status === 0;
      }
    }
  }


  onClickDelete(batch: Batch) {
    if (batch.status === 0) {
      this._modalDelete = true;
      this._selectedBatchToBeDeleted = batch;
    }
  }


  onConfirmDelete(batchId: string) {
    this.campaignService.deleteBatch(this._selectedBatchToBeDeleted._id).pipe(first()).subscribe(() => {
      this._stats.batches.splice(this.getBatchIndex(this._selectedBatchToBeDeleted._id), 1);
      this._tableBatch = this._stats.batches.map((batch: any) => {
        return this.generateTableBatch(batch);
      });
      this._selectedBatchToBeDeleted = null;
      this._modalDelete = false;
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.DELETED');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  OnSwitchFreeze(batch: Batch, event: Event) {
    this.campaignService.freezeStatus(batch).pipe(first()).subscribe((modifiedBatch: any) => {
      this._stats.batches[this.getBatchIndex(modifiedBatch._id)] = modifiedBatch;
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.FREEZED');
    }, () => {
      event.target['checked'] = batch.active;
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  OnClickEdit(row: any, batch: Batch) {
    let step;

    switch (row.Step) {

      case ('01 - Hello World') :
        step = 'FIRST';
        this._currentStep = 0;
        break;

      case ('02 - 2nd try')  :
        step = 'SECOND';
        this._currentStep = 1;
        break;

      case ('03 - 3rd try') :
        step = 'THIRD';
        this._currentStep = 2;
        break;

      case ('04 - Thanks') :
        step = 'THANKS';
        this._currentStep = 3;
        break;

      default:
        //do nothing...

    }

    this._content = this.getContentWorkflowStep(batch._id, step);
    this._currentRow = row;
    this._currentBatch = batch;
    this.activateSidebar('editBatch');
  }


  private getContentWorkflowStep(batchID: any, step: any): any {
    const index = this.getBatchIndex(batchID);
    const workflowName = this.getWorkflowName(index);
    const content = {en: '', fr: ''};

    this.campaign.settings.emails.forEach( mail => {
      if (mail.step === step && workflowName === mail.nameWorkflow) {
        if (mail.language === 'en') {
          content.en = mail.content;
        } else {
          content.fr = mail.content;
        }
      }
    });

    return content;
  }


  private updateBatch(formValue: FormGroup) {

    switch (this._currentStep) {

      case 0:
        this._currentBatch.firstMail = this.computeDate(formValue.value['date'], formValue.value['time']);
        break;

      case 1:
        this._currentBatch.secondMail = this.computeDate(formValue.value['date'], formValue.value['time']);
        break;

      case 2:
        this._currentBatch.thirdMail = this.computeDate(formValue.value['date'], formValue.value['time']);
        break;

      default:
        //do nothing...

    }

    this.campaignService.updateBatch(this._currentBatch).pipe(first()).subscribe((batch: any) => {
      this._stats.batches[this.getBatchIndex(batch)] = batch;

      this._tableBatch.every((table, index) => {
        if (table._selector === batch._id) {
          this._tableBatch[index] = this.generateTableBatch(batch);
          return false;
        }
        return true;
      });

      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.BATCH.UPDATED');

    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'SERVER_ERROR');
    });

  }


  /*public addNuggetsToBatch(batchId: string) {
    this.nuggetsBatch = null;
    this.campaignService.addNuggets(this._campaign._id, batchId).pipe(first()).subscribe((batch: any) => {
      this.stats.batches[this.getBatchIndex(batch._id)] = batch;
      this.translateNotificationsService.success('Nuggets ajoutés', `${batch.nuggetsPros} pros à 80% ont été ajoutés.`);
    });
  }*/


  // DEBUG AUTOBATCH => Creation de pro a la volée
  /*createPro() {
    this.campaignService.creerpro(this._campaign._id).pipe(first()).subscribe();
  }*/

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get autoBatchStatus() {
    return ( this.quiz && this.innovationStatus && this.templatesStatus && (this.statusAB !== '1'));
  }

  get templatesStatus(): boolean {
    return (this._campaign.settings.emails.length !== 0);
  }

  get innovationStatus() {
    return ((this._campaign.innovation.status === 'EVALUATING' || this._campaign.innovation.status === 'DONE'));
  }

  get statusAB() {
    return this._campaign.settings.ABsettings ? this._campaign.settings.ABsettings.status : null;
  }

  get defaultWorkflow() {
    return  this._campaign.settings.defaultWorkflow;
  }

  get quiz() {
    return (this._campaign && this._campaign.innovation && this._campaign.innovation.quizId !== '');
  }

  get campaign() {
    return this._campaign;
  }

  get quizLinks() {
    return this._quizLinks;
  }

  get stats() {
    return this._stats;
  }

  tableBatch(index: number) {
    return this._tableBatch[index];
  }

  get currentStep(): number {
    return this._currentStep;
  }

  get currentBatch(): Batch {
    return this._currentBatch;
  }

  get content(): {} {
    return this._content;
  }

  get currentRow(): {} {
    return this._currentRow;
  }

  get config(): any {
    return this._config;
  }

  get noResult(): boolean {
    return this._noResult;
  }

  get firstAutoBatch(): boolean {
    return this._firstAutoBatch;
  }

  get selectedBatchToBeDeleted(): Batch {
    return this._selectedBatchToBeDeleted;
  }

  get newBatch(): Batch {
    return this._newBatch;
  }

  get modalDelete(): boolean {
    return this._modalDelete;
  }

  set modalDelete(value: boolean) {
    this._modalDelete = value;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

}
