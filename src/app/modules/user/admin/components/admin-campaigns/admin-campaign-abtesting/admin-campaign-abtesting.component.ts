import { Component, OnInit, Input } from '@angular/core';
import { EmailScenario } from '../../../../../../models/email-scenario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Campaign } from '../../../../../../models/campaign';
import {Table} from '../../../../../table/models/table';
import {Batch} from '../../../../../../models/batch';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-campaign-abtesting',
  templateUrl: './admin-campaign-abtesting.component.html',
  styleUrls: ['./admin-campaign-abtesting.component.scss']
})
export class AdminCampaignAbtestingComponent implements OnInit {

  @Input() set modifiedScenarios(arg: Array<EmailScenario>) {
    this._modifiedScenarios = arg;
  }
  @Input() set campaign(arg: Campaign) {
    this._campaign = arg;
  }

  public switchActivated: Boolean = false;

  public modalABtesting = false;
  private _campaign: Campaign;
  private _modifiedScenarios: Array<EmailScenario> ;
  private _nameWorkflowA = '';
  private _nameWorkflowB = '';
  private _tableA: Table;
  private _tableB: Table;

  private _avertABtesting = false;


  private _statsA: Array<{
    delivered: number,
    opened: number,
    clicked: number,
    insights: number,
    bounced: number
  }>;
  private _statsB: Array<{
    delivered: number,
    opened: number,
    clicked: number,
    insights: number,
    bounced: number
  }>;
  private _sizeA: number;
  private _sizeB: number;
  private _batchesLength = 0;



  form: FormGroup;
  public config: any = {
    sort: {},
    search: {}
  };




  constructor(private formBuilder: FormBuilder,
              private _campaignService: CampaignService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {

    this._campaignService.messagesStats(this._campaign._id).pipe(first()).subscribe((stats: any) => {
      this._batchesLength = stats.batches.length;
    });


    // Data initi
    const defAB = {
      delivered: 0,
      opened: 0,
      clicked: 0,
      insights: 0,
      bounced: 0
    };
    this._statsA = [defAB, defAB, defAB];
    this._statsB = [defAB, defAB, defAB];

    if (this._campaign.settings.ABsettings && this._campaign.settings.ABsettings.nameWorkflowA) {
      this._nameWorkflowA = this._campaign.settings.ABsettings.nameWorkflowA;
    }

    if (this._campaign.settings.ABsettings && this._campaign.settings.ABsettings.nameWorkflowB) {
      this._nameWorkflowB = this._campaign.settings.ABsettings.nameWorkflowB;
    }


    this.form = this.formBuilder.group({
      workflowA: ['', [Validators.required]],
      workflowB: ['', [Validators.required]],
      sizeA: ['', [Validators.required]],
      sizeB: ['', [Validators.required]]
    });
    this.form.disable();

    if (this._campaign.settings.ABsettings && this._campaign.settings.ABsettings.status !== '0') {
      this._nameWorkflowA = this._campaign.settings.ABsettings.nameWorkflowA;
      this._nameWorkflowB = this._campaign.settings.ABsettings.nameWorkflowB;
      this.getStatsBatch();
    }
  }

  // MessageStats => Recupere tout les batch de la campagne sans les update (moins lourd, on update sur demande en statut 2)
  public getStatsBatch() {
    this._campaignService.messagesStats(this.campaign._id).pipe(first()).subscribe((result: any) => {
      this._sizeA = result.batches[0].size;
      this._sizeB = result.batches[1].size;
      this._statsA = result.batches[0].stats;
      this._statsB = result.batches[1].stats;
      this._generateStatsTable();
    });
  }

  public validateABtesting() {
    this._campaign.settings.ABsettings.status = '2';
    this._campaignService.put(this._campaign).pipe(first()).subscribe((savedCampaign: any) => {
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }

  public startABtesting() {
    this._avertABtesting = false;
    if (this.campaign.stats.nbPros90 > 0) {
      if (this.sizeA + this.sizeB > this.campaign.stats.nbPros90) {
        const mid = Math.floor(this.campaign.stats.nbPros90 / 2);
        this.sizeA = mid;
        this.sizeB = this.campaign.stats.nbPros90 - mid;
      }
      // obj = [Absettings, sizeA, size B]
      this._campaignService.startABtesting(this.campaign._id, this.nameWorkflowA, this.nameWorkflowB, this.sizeA, this.sizeB)
        .pipe(first())
        .subscribe((obj: Array<any>) => {
          if (obj.length === 0) {
            this._notificationsService.error('ERROR.ERROR', 'Not enough Pros in campaign');
          } else {
            this._campaign.settings.ABsettings = obj[0];
            this._sizeA = obj[1];
            this._sizeB = obj[2];
            this._generateStatsTable();
            this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
          }
        }, (err: any) => {
          this._notificationsService.error('ERROR.ERROR', err);
        });
    } else {
      this._notificationsService.error('ERROR.ERROR', 'Please, update stats of campaign or wait for pros. ')
    }
  }

  private _generateOneTable(l: 'A' | 'B'): Table {
    const self = this as any;
    const digit = 2; // Number of decimals.
    return {
      _selector: 'TODO',
      _title: self[`_nameWorkflow${l}`],
      _content: [
        {
          Step: ' 1er mail',
          Sent: self[`_stats${l}`][0].delivered + self[`_stats${l}`][0].bounced,
          Opened: ((self[`_stats${l}`][0].opened / self[`_size${l}`]) * 100).toFixed(digit) + '%',
          Clicked: ((self[`_stats${l}`][0].clicked / self[`_size${l}`]) * 100).toFixed(digit) + '%',
          Insights: self[`_stats${l}`][0].insights,
          Status: this.getStatus(0, self[`_status${l}`])
        }, {
          Step: ' 2eme mail',
          Sent: self[`_stats${l}`][1].delivered + self[`_stats${l}`][1].bounced,
          Opened: ((self[`_stats${l}`][1].opened / self[`_size${l}`]) * 100).toFixed(digit) + '%',
          Clicked: ((self[`_stats${l}`][1].clicked / self[`_size${l}`]) * 100).toFixed(digit) + '%',
          Insights: self[`_stats${l}`][1].insights,
          Status: this.getStatus(1, self[`_status${l}`])
        }, {
          Step: ' 3eme mail',
          Sent: self[`_stats${l}`][2].delivered + self[`_stats${l}`][2].bounced,
          Opened: ((self[`_stats${l}`][2].opened / self[`_size${l}`]) * 100).toFixed(digit) + '%',
          Clicked: ((self[`_stats${l}`][2].clicked / self[`_size${l}`]) * 100).toFixed(digit) + '%',
          Insights: self[`_stats${l}`][2].insights ,
          Status: this.getStatus(2, self[`_status${l}`])
        }],
      _total: self[`_size${l}`],
      _isTitle: true,
      _isNoMinHeight: true,
      _columns: [{
        _attrs: ['Step'],
        _name: 'Step',
        _type: 'TEXT',
      }, {
        _attrs: ['Sent'],
        _name: 'Sent',
        _type: 'TEXT',
      }, {
        _attrs: ['Opened'],
        _name: 'Opened',
        _type: 'TEXT',
      }, {
        _attrs: ['Clicked'],
        _name: 'Clicked',
        _type: 'TEXT',
      }, {
        _attrs: ['Insights'],
        _name: 'Insights',
        _type: 'TEXT',
      }, {
        _attrs: ['Status'], _name: 'Status', _type: 'MULTI-CHOICES',
        _choices: [
          {_name: 'Sent', _class: 'label label-progress'},
          {_name: 'Planned',  _class: 'label label-success'},
        ]}]
    };
  }

  private _generateStatsTable() {
    this._tableA = this._generateOneTable("A");
    this._tableB = this._generateOneTable("B");
  };

  private getStatus(step: number, status: number): string {
    return status > step ? 'Sent' : 'Planned';
  }

  public statusSwitch() {
    this.modalABtesting = true;
    this.switchActivated = !this.switchActivated;
    if (this.switchActivated) {
      this.form.enable();
    } else {
      this.modalABtesting = false;
      this.form.disable();
    }
  }

  public updateStatsBatches() {
    this._campaignService.updateBatchesStats(this.campaign._id).pipe(first()).subscribe((obj: Array<Batch>) => {
      this._statsA = obj[0].stats;
      this._statsB = obj[1].stats;
      this._sizeA = obj[0].size;
      this._sizeB = obj[1].size;
      this._generateStatsTable();
    });
  }

  public setAvertAB(b: boolean) {
    this._avertABtesting = b;
  }

  public ABDISPO() {
    return this._campaign && this._campaign.innovation && this._campaign.innovation.quizId !== ""  && this._modifiedScenarios.length >= 2;
  }


  get nameWorkflowA(): string { return this._nameWorkflowA };
  get nameWorkflowB(): string { return this._nameWorkflowB };
  get sizeA(): number { return this._sizeA };
  get sizeB(): number { return this._sizeB };
  get modifiedScenarios(): Array<EmailScenario> { return this._modifiedScenarios };
  get campaign(): Campaign { return this._campaign };
  get statsA(): any { return this._statsA };
  get statsB(): any { return this._statsB };
  get tableA(): Table {return this._tableA};
  get tableB(): Table {return this._tableB};
  get batchesLength(): number { return this._batchesLength };
  get avertAB(): boolean { return this._avertABtesting; }

  set nameWorkflowA(arg: string) { this._nameWorkflowA = arg};
  set nameWorkflowB(arg: string) { this._nameWorkflowB = arg};
  set sizeA(arg: number) { this._sizeA = arg};
  set sizeB(arg: number) { this._sizeB = arg};
}
