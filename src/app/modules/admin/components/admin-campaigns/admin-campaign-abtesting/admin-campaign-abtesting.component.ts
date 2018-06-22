import { Component, OnInit, Input } from '@angular/core';
import { EmailScenario } from '../../../../../models/email-scenario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Campaign } from '../../../../../models/campaign';
import {Table} from '../../../../shared/components/shared-table/models/table';
import {Batch} from '../../../../../models/batch';

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

  private _campaign: Campaign;
  private _status: number;
  private _modifiedScenarios: Array<EmailScenario> ;
  private _nameWorkflowA = '';
  private _nameWorkflowB = '';
  private _tableA: Table;
  private _tableB: Table;


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




  form: FormGroup;
  public config: any = {
    sort: {},
    search: {}
  };




  constructor(private formBuilder: FormBuilder,
              private _campaignService: CampaignService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {

    const defAB = {
      delivered: 0,
      opened: 0,
      clicked: 0,
      insights: 0,
      bounced: 0
    };
    this._statsA = [defAB, defAB, defAB];
    this._statsB = [defAB, defAB, defAB];

    this._status = this._campaign.settings.ABsettings.status;

    if (this._campaign.settings.ABsettings.nameWorkflowA) {
      this._nameWorkflowA = this._campaign.settings.ABsettings.nameWorkflowA;
    }
    if ( this._campaign.settings.ABsettings.nameWorkflowB ) {
      this._nameWorkflowB = this._campaign.settings.ABsettings.nameWorkflowB;
    }
    this.form = this.formBuilder.group({
      workflowA: ['', [Validators.required]],
      workflowB: ['', [Validators.required]],
      sizeA: ['', [Validators.required]],
      sizeB: ['', [Validators.required]]
    });
    if (this.switchActivated) {
      this.form.enable();
    } else {
      this.form.disable();
    }

    console.log("ABStatus Campagne : " + this.campaign.settings.ABsettings.status);
    //Uniquement en statut 1 en 2 on le fait manuellement
    if (this.campaign.settings.ABsettings.status == 1) {
      this.updateStatsBatches();
    }
    //On recupere les deux batchs -> route de getBatch
    if (this.campaign.settings.ABsettings.status == 2) {
      this.getStatsBatch();
    }
  }


  // MessageStats => Recupere tout les batch de la campagne
  public getStatsBatch() {
    this._campaignService.messagesStats(this.campaign._id).subscribe(batches => {
      this._sizeA = batches[0].size;
      this._sizeB = batches[1].size;
      this._statsA = batches[0].stats;
      this._statsB = batches[0].stats;
    });
  }

  public validateABtesting() {
    this._campaign.settings.ABsettings.status = 2;
    this._campaignService.put(this._campaign).first().subscribe(savedCampaign => {
      this._status = 2;
      this._notificationsService.success("ERROR.SUCCESS", "ERROR.ACCOUNT.UPDATE");
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }


  public startABtesting() {
    if (this.campaign.stats.nbPros90 > 0) {
      if (this.sizeA + this.sizeB > this.campaign.stats.nbPros90) {
        if (this.sizeA > this.sizeB) {
          this.sizeA = this.campaign.stats.nbPros90 - this.sizeB
        }
        else {
          this.sizeB = this.campaign.stats.nbPros90 - this.sizeA
        }
      }
      // obj = [Absettings, sizeA, size B]
      this._campaignService.startABtesting(this.campaign._id, this.nameWorkflowA, this.nameWorkflowB, this.sizeA, this.sizeB)
        .subscribe((obj: Array<any>) => {
          if (obj.length === 0) {
            this._notificationsService.error('ERROR.ERROR', 'Not enough Pros in campaign');
          } else {
            this._status = 1;
            this._campaign.settings.ABsettings = obj[0];
            this._sizeA = obj[1];
            this._sizeB = obj[2];
            this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
          }
        }, (err: any) => {
          this._notificationsService.error('ERROR.ERROR', err);
        });
    } else {
      this._notificationsService.error('ERROR.ERROR', 'Please, update stats of campaign or wait for pros. ')
    }
  }


  public generateStatsTable() {
    console.log(' JE SUIS A ' + this._sizeA);
    console.log(' JE SUIS B ' + this._sizeB);
    this._table = {
      _selector: 'TODO',
      _title: 'A/B Testing',
      _content: [{
          Workflow: this._nameWorkflowA + ' 1er mail',
          Delivered: this._statsA[0].delivered,
          Opened: this._statsA[0].opened,
          Clicked: this._statsA[0].clicked,
          Insights: this._statsA[0].insights,
        }, {
          Workflow: this._nameWorkflowA + ' 2eme mail',
          Delivered: this._statsA[1].delivered,
          Opened: this._statsA[1].opened,
          Clicked: this._statsA[1].clicked,
          Insights: this._statsA[1].insights,
        }, {
          Workflow: this._nameWorkflowA + ' 3eme mail',
          Delivered: this._statsA[2].delivered,
          Opened: this._statsA[2].opened,
          Clicked: this._statsA[2].clicked,
          Insights: this._statsA[2].insights,
        }, {
          Workflow: this._nameWorkflowB + ' 1er mail',
          Delivered: this._statsB[0].delivered,
          Opened: this._statsB[0].opened,
          Clicked: this._statsB[0].clicked,
          Insights: this._statsB[0].insights,
        }, {
          Workflow: this._nameWorkflowB + ' 2eme mail',
          Delivered: this._statsB[1].delivered,
          Opened: this._statsB[1].opened,
          Clicked: this._statsB[1].clicked,
          Insights: this._statsB[1].insights,
        }, {
          Workflow: this._nameWorkflowB + ' 3eme mail',
          Delivered: this._statsB[2].delivered,
          Opened: this._statsB[2].opened,
          Clicked: this._statsB[2].clicked,
          Insights: this._statsB[2].insights,
      }],
      _total: 1,
      _columns: [{
        _attr: 'Workflow',
        _name: 'Workflow',
        _type: 'String'
      }, {
        _attr: 'Delivered',
        _name: 'Delivered',
        _type: 'String'
      }, {
        _attr: 'Opened',
        _name: 'Opened',
        _type: 'String'
      }, {
        _attr: 'Clicked',
        _name: 'Clicked',
        _type: 'String'
      }, {
        _attr: 'Insights',
        _name: 'Insights',
        _type: 'String'
      }]
    }
  };


  public statusSwitch() {
    this.switchActivated = !this.switchActivated;
    if (this.switchActivated) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }


  public updateStatsBatches() {
    this._campaignService.updateBatchesStats(this.campaign._id).subscribe((obj: Array<Batch>) => {
      this._statsA = obj[0].stats;
      this._statsB = obj[1].stats;
      this._sizeA = obj[0].size;
      this._sizeB = obj[1].size;
      this.generateStatsTable();
    });
  }

  get nameWorkflowA(): string { return this._nameWorkflowA };
  get nameWorkflowB(): string { return this._nameWorkflowB };
  get sizeA(): number { return this._sizeA };
  get sizeB(): number { return this._sizeB };
  get modifiedScenarios(): Array<EmailScenario> { return this._modifiedScenarios };
  get campaign(): Campaign { return this._campaign };
  get statsA(): any { return this._statsA };
  get statsB(): any { return this._statsB };
  get status(): number { return this._status };
  get table(): any {return this._table};


  set nameWorkflowA(arg: string) { this._nameWorkflowA = arg};
  set nameWorkflowB(arg: string) { this._nameWorkflowB = arg};
  set sizeA(arg: number) { this._sizeA = arg};
  set sizeB(arg: number) { this._sizeB = arg};

}
