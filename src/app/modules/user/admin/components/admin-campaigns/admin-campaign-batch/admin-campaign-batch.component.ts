import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Campaign} from '../../../../../../models/campaign';
import {CampaignService} from '../../../../../../services/campaign/campaign.service';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {Batch} from '../../../../../../models/batch';
import {Table} from '../../../../../table/models/table';
import {SidebarInterface} from '../../../../../sidebars/interfaces/sidebar-interface';
import {CampaignFrontService} from '../../../../../../services/campaign/campaign-front.service';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {isPlatformBrowser} from '@angular/common';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {RolesFrontService} from "../../../../../../services/roles/roles-front.service";
import {StatsInterface} from "../admin-campaign-stats/admin-campaign-stats.component";

@Component({
  templateUrl: './admin-campaign-batch.component.html',
  styleUrls: ['./admin-campaign-batch.component.scss']
})

export class AdminCampaignBatchComponent implements OnInit {

  private _campaign: Campaign = <Campaign>{};

  private _stats: any = {};

  private _batchesTable: Array<Table> = [];

  private _localConfig: any = {
    sort: {},
    search: {}
  };

  private _currentBatch: Batch = <Batch>{};

  private _content: any = {};

  private _currentRow = {};

  private _currentStep = 0;

  private _selectedBatchToBeDeleted: Batch = <Batch>{};

  private _modalDelete = false;

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  private _campaignWorkflows: Array<string> = [];

  private _fetchingError = true;

  private _isDeletingBatch = false;

  private _isLoading = true;

  private _isEditable = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateService: TranslateService) { }

  ngOnInit() {
    if (this._activatedRoute.snapshot.parent.data['campaign']
      && typeof this._activatedRoute.snapshot.parent.data['campaign'] !== undefined) {
      this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
      this._getBatches();

      const _scenariosNames: Set<string> = new Set<string>();

      if (this._campaign.settings && this._campaign.settings.emails) {
        this._campaign.settings.emails.forEach((email) => {
          if (email.modified) {
            _scenariosNames.add(email.nameWorkflow);
          } else {
            _scenariosNames.delete(email.nameWorkflow);
          }
        });
      }

      _scenariosNames.forEach((name) => {
        this._campaignWorkflows.push(name);
      });

    }
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project', 'campaigns', 'campaign', 'batch'];
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(_default);
    }
  }

  public statsConfig(): Array<StatsInterface> {
    return [
      {
        heading: 'Emails',
        content: [
          {subHeading: 'To send', value: this._campaignStat('good_emails').toString(10)},
          {subHeading: 'Received', value: this._campaignStat('received').toString(10)},
          {subHeading: 'Bounces', value: this._campaignStat('bounces').toString(10)}
        ]
      },
      {
        heading: 'Interaction',
        content: [
          {subHeading: 'Opened', value: this._campaignStat('opened') + '%'},
          {subHeading: 'Clicked', value: this._campaignStat('clicked') + '%'},
          {subHeading: 'Answer rate', value: this._campaignStat('answer_rate') + '%'},
        ]
      },
      {
        heading: 'Display',
        content: [
          {subHeading: 'Email', value: this._campaignStat('email').toString(10)},
          {subHeading: 'Questionnaire', value: this._campaignStat('questionnaire').toString(10)},
        ]
      }
    ];
  }

  private _campaignStat(searchKey: string): number {
    return CampaignFrontService.getBatchCampaignStat(this._campaign, searchKey);
  }

  private _reinitializeVariables() {
    this._stats = {};
    this._batchesTable = [];
  }

  private _getBatches() {
    if (isPlatformBrowser(this._platformId)) {
      this._campaignService.messagesStats(this._campaign._id).pipe(first()).subscribe((stats) => {
        this._stats = stats;
        this._batchesTable = [];
        if (this._stats.batches) {
          this._stats.batches.forEach((batch: Batch) => {
            this._batchesTable.push(this._initBatchTable(batch));
          });
        }
        this._isLoading = false;
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isLoading = false;
        console.error(err);
      });
    }
  }

  private _initBatchTable(batch: Batch): Table {

    const firstJSdate = new Date(batch.firstMail);
    const firstTime = ('0' + firstJSdate.getHours()).slice(-2) + ':' + ('0' + firstJSdate.getMinutes()).slice(-2);

    const secondJSdate = new Date(batch.secondMail);
    const secondTime = ('0' + secondJSdate.getHours()).slice(-2) + ':' + ('0' + secondJSdate.getMinutes()).slice(-2);

    const thirdJSdate = new Date(batch.thirdMail);
    const thirdTime = ('0' + thirdJSdate.getHours()).slice(-2) + ':' + ('0' + thirdJSdate.getMinutes()).slice(-2);

    const workflowName = ('Workflow ' + this._workflowName(batch)).toString();

    const digit = 1; // number of decimals stats/pred

    if (!batch.predictions || batch.predictions.length === 0) {
      const reset = {opened: 0, clicked: 0, insights: 0};
      batch.predictions = [reset, reset, reset];
    }

    return {
      _selector: batch._id,
      _clickIndex: (this.canAccess(['view']) || this.canAccess(['edit'])) ? 1 : null,
      _isNoMinHeight: true,
      _content: [
        {
          Step: '01 - Hello World',
          Sent: batch.stats[0].delivered + batch.stats[0].bounced,
          OpenedPred: ((batch.predictions[0].opened * 100).toFixed(digit) + '%' || ''),
          OpenedReel: ((batch.stats[0].opened / batch.size) * 100).toFixed(digit) + '%',
          ClickedPred: ((batch.predictions[0].clicked * 100).toFixed(digit) + '%' || ''),
          ClickedReel: ((batch.stats[0].clicked / batch.size) * 100).toFixed(digit) + '%',
          InsightsPred: batch.predictions[0].insights,
          InsightsReel: batch.stats[0].insights,
          Date: batch.firstMail,
          Time: firstTime,
          Status: AdminCampaignBatchComponent._getStatus(0, batch.status)
        }, {
          Step: '02 - 2nd try',
          Sent: batch.stats[1].delivered + batch.stats[1].bounced,
          OpenedPred: ((batch.predictions[1].opened * 100).toFixed(digit) + '%' || ''),
          OpenedReel: ((batch.stats[1].opened / batch.size) * 100).toFixed(digit) + '%',
          ClickedPred: ((batch.predictions[1].clicked * 100).toFixed(digit) + '%' || ''),
          ClickedReel: ((batch.stats[1].clicked / batch.size) * 100).toFixed(digit) + '%',
          InsightsPred: batch.predictions[1].insights,
          InsightsReel: batch.stats[1].insights,
          Date: batch.secondMail,
          Time: secondTime,
          Status: AdminCampaignBatchComponent._getStatus(1, batch.status)
        }, {
          Step: '03 - 3rd try',
          Sent: batch.stats[2].delivered + batch.stats[2].bounced,
          OpenedPred: ((batch.predictions[2].opened * 100).toFixed(digit) + '%' || ''),
          OpenedReel: ((batch.stats[2].opened / batch.size) * 100).toFixed(digit) + '%',
          ClickedPred: ((batch.predictions[2].clicked * 100).toFixed(digit) + '%' || ''),
          ClickedReel: ((batch.stats[2].clicked / batch.size) * 100).toFixed(digit) + '%',
          InsightsPred: batch.predictions[2].insights,
          InsightsReel: batch.stats[2].insights,
          Date: batch.thirdMail,
          Time: thirdTime,
          Status: AdminCampaignBatchComponent._getStatus(2, batch.status)
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
        _type: 'TEXT'
      }, {
        _attrs: ['OpenedPred', 'OpenedReel'],
        _name: 'Opened',
        _type: 'MULTI-LABEL',
        _multiLabels: [
          {_attr: 'OpenedReel', _class: 'label is-success'},
          {_attr: 'OpenedPred', _class: 'label is-info'}
        ],
      }, {
        _attrs: ['ClickedPred', 'ClickedReel'],
        _name: 'Clicked',
        _type: 'MULTI-LABEL',
        _multiLabels: [
          {_attr: 'ClickedReel', _class: 'label is-success'},
          {_attr: 'ClickedPred', _class: 'label is-info'}
        ],
      }, {
        _attrs: ['InsightsPred', 'InsightsReel'],
        _name: 'Insights',
        _type: 'MULTI-LABEL',
        _multiLabels: [
          {_attr: 'InsightsReel', _class: 'label is-success'},
          {_attr: 'InsightsPred', _class: 'label is-info'}
        ],
      }, {
        _attrs: ['Date'],
        _name: 'Date',
        _type: 'DATE'
      }, {
        _attrs: ['Time'],
        _name: 'Time',
        _type: 'TEXT'
      }, {
        _attrs: ['Status'], _name: 'Status', _type: 'MULTI-CHOICES',
        _choices: [
          {_name: 'Sent', _class: 'label is-success'},
          {_name: 'Planned', _class: 'label is-progress'}
        ]
      }]
    };

  }

  private static _getStatus(step: number, status: number): string {
    return status > step ? 'Sent' : 'Planned';
  }

  public onUpdateStats(value: boolean) {
    if (value) {
      this._campaignService.updateStats(this._campaign._id).pipe(first()).subscribe(() => {
        this._reinitializeVariables();
        this._getBatches();
        this._translateNotificationsService.success('Success', 'The stats have been updated.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    }
  }

  public activateSidebar(type: string) {
    switch (type) {

      case 'NEW_BATCH':
        this._isEditable = true;
        this._sidebarValue = {
          animate_state: 'active',
          type: 'NEW_BATCH',
          title: 'New Batch'
        };
        break;

      case 'EDIT_BATCH':
        this._isEditable = this.canAccess(['edit']);
        this._sidebarValue = {
          animate_state: 'active',
          type: 'EDIT_BATCH',
          title: this.canAccess(['edit']) ? 'Edit Batch' : 'Batch',
          size: '726px'
        };
        break;

    }
  }

  /***
   * result won't be typed as batch every-time
   * @param event
   */
  public onSwitchAutoBatch(event: Event) {
    this._campaignService.AutoBatch(this._campaign._id).pipe().subscribe((campaign: Campaign) => {
      this._campaign.autoBatch = campaign.autoBatch;
      const message = campaign.autoBatch ? 'The autobatch is on for this campaign. Batches will be created soon.'
        : 'The autobatch is off for this campaign. No new batch will be created.';
      this._translateNotificationsService.success('Success', message);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public setNuggets() {
    this._campaignService.setNuggets(this._campaign._id).pipe(first()).subscribe((result: Campaign) => {
      this._campaign = result;
      if (this._campaign.nuggets) {
        this._translateNotificationsService.success('Success', 'The nuggets have been activated.');
      } else {
        this._translateNotificationsService.success('Success', 'The nuggets have been deactivated.');
      }
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public onSidebarOutput(form: FormGroup) {
    switch (this._sidebarValue.type) {

      case 'NEW_BATCH':
        this._createNewBatch(form);
        break;

      case 'EDIT_BATCH':
        this.updateBatch(form);
        break;

    }
  }

  private _createNewBatch(formValue: FormGroup) {
    const _newBatch: Batch = {
      size: formValue.value['pros'],
      firstMail: formValue.value['send'] === 'true'
        ? Date.now() : AdminCampaignBatchComponent._computeDate(formValue.value['date'], formValue.value['time']||"00:00"),
      sendNow: formValue.value['send'],
      campaign: this._campaign,
      active: true
    };

    this._campaignService.createNewBatch(this._campaign._id, _newBatch).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Success', 'The batch is created.');
      this._closeSidebar();
      this._reinitializeVariables();
      this._getBatches();
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });

  }

  private _closeSidebar() {
    this._sidebarValue = {
      animate_state: 'inactive'
    };
  }

  /***
   * Calcule d'une date d'envoi à partir des inputs de la date et heure
   * @param date
   * @param time
   */
  private static _computeDate(date: string, time: string) {
    const computedDate = new Date(date);
    const hours = parseInt(time.split(':')[0], 10);
    const minutes = parseInt(time.split(':')[1], 10);
    computedDate.setHours(hours);
    computedDate.setMinutes(minutes);
    return computedDate;
  }

  private _getBatchIndex(batchId: string): number {
    for (const batch of this._stats.batches) {
      if (batchId === batch._id) {
        return this._stats.batches.indexOf(batch);
      }
    }
  }

  private _workflowName(batch: Batch) {
    return batch.workflow || (this._campaign.settings && this._campaign.settings.defaultWorkflow);
  }

  public getDeleteStatus(batch: Batch) {
    if (this._campaign.settings && this._campaign.settings.ABsettings && this._campaign.settings.ABsettings.status
      && this._campaign.settings.ABsettings.status === '0') {
      return batch.status === 0;
    } else {
      if ((this._campaign.settings && this._campaign.settings.ABsettings && this._campaign.settings.ABsettings.batchA
        && this._campaign.settings.ABsettings.batchA === batch._id) || (this._campaign.settings
        && this._campaign.settings.ABsettings && this._campaign.settings.ABsettings.batchB
        && this._campaign.settings.ABsettings.batchB === batch._id)) {
        return false;
      } else {
        return batch.status === 0;
      }
    }
  }

  public onDeleteBatch(event: Event, batch: Batch) {
    event.preventDefault();
    this._selectedBatchToBeDeleted = <Batch>{};
    this._modalDelete = true;
    this._selectedBatchToBeDeleted = batch;
  }

  public onConfirmDelete(event: Event) {
    event.preventDefault();
    if (!this._isDeletingBatch) {
      this._isDeletingBatch = true;
      this._campaignService.deleteBatch(this._selectedBatchToBeDeleted._id).pipe(first()).subscribe(() => {
        this._isDeletingBatch = false;
        this._reinitializeVariables();
        this._getBatches();
        this._modalDelete = false;
        this._translateNotificationsService.success('Success', 'The batch is deleted.');
      }, (err: HttpErrorResponse) => {
        this._isDeletingBatch = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    }
  }

  public OnSwitchFreeze(event: Event, batch: Batch) {
    event.preventDefault();
    this._campaignService.freezeStatus(batch).pipe(first()).subscribe((modifiedBatch: any) => {
      this._stats.batches[this._getBatchIndex(modifiedBatch._id)] = modifiedBatch;
      this._translateNotificationsService.success('Success', 'The batch is frozen.');
    }, (err: HttpErrorResponse) => {
      (event.target as HTMLInputElement).checked = batch.active;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public onClickEdit(row: any, batch: Batch) {
    let step = '';

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

    }

    this._content = this._contentWorkflowStep(batch, step);
    this._currentRow = row;
    this._currentBatch = batch;
    this.activateSidebar( 'EDIT_BATCH');
  }

  private _contentWorkflowStep(batch: Batch, step: any): any {
    const workflowName = this._workflowName(batch);
    const content = {en: '', fr: '', _id: batch._id};

    if (this._campaign.settings && this._campaign.settings.emails) {
      this._campaign.settings.emails.forEach( (mail) => {
        if (mail.step === step && workflowName === mail.nameWorkflow) {
          if (mail.language === 'en') {
            content.en = mail.content;
          } else {
            content.fr = mail.content;
          }
        }
      });
    }

    return content;
  }

  private updateBatch(formValue: FormGroup) {
    switch (this._currentStep) {

      case 0:
        this._currentBatch.firstMail = AdminCampaignBatchComponent._computeDate(formValue.value['date'], formValue.value['time']);
        break;

      case 1:
        this._currentBatch.secondMail = AdminCampaignBatchComponent._computeDate(formValue.value['date'], formValue.value['time']);
        break;

      case 2:
        this._currentBatch.thirdMail = AdminCampaignBatchComponent._computeDate(formValue.value['date'], formValue.value['time']);
        break;

    }

    this._currentBatch.workflow = formValue.value['workflow'];

    this._campaignService.updateBatch(this._currentBatch).pipe(first()).subscribe((batch) => {
      this._stats.batches[this._getBatchIndex(batch._id)] = batch;
      this._batchesTable.every((table, index) => {
        if (table._selector === batch._id) {
          this._batchesTable[index] = this._initBatchTable(batch);
          return false;
        }
        return true;
      });
      this._translateNotificationsService.success('Success', 'The batch is updated.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  // DEBUG AUTOBATCH => Creation de pro a la volée
  /*createPro() {
    this._campaignService.creerpro(this._campaign._id).subscribe();
  }*/

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get autoBatchStatus() {
    return ( this.quiz && this.innovationStatus && this.templatesStatus && (this.statusAB !== '1'));
  }

  get templatesStatus(): boolean {
    return this._campaign.settings && this._campaign.settings.emails && this._campaign.settings.emails.length !== 0;
  }

  get innovationStatus() {
    return (this._campaign.innovation && this._campaign.innovation.status
      && (this._campaign.innovation.status === 'EVALUATING' || this._campaign.innovation.status === 'DONE'));
  }

  get statusAB() {
    return this._campaign.settings && this._campaign.settings.ABsettings ? this._campaign.settings.ABsettings.status : null;
  }

  get defaultWorkflow() {
    return this._campaign.settings && this._campaign.settings.defaultWorkflow ;
  }

  get quiz() {
    return (this._campaign && this._campaign.innovation && this._campaign.innovation.quizId !== '');
  }

  get campaign() {
    return this._campaign;
  }

  get stats() {
    return this._stats;
  }

  getBatch(index: number) {
    return this._batchesTable[index];
  }

  get batchesTable() {
    return this._batchesTable;
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

  get localConfig(): any {
    return this._localConfig;
  }

  get selectedBatchToBeDeleted(): Batch {
    return this._selectedBatchToBeDeleted;
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

  get campaignWorkflows(): Array<string> {
    return this._campaignWorkflows;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get isDeletingBatch(): boolean {
    return this._isDeletingBatch;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

}
