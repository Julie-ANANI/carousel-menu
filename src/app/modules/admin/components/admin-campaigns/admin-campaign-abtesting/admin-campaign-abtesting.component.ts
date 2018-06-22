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


  // MessageStats => Recupere tout les batch de la campagne sans les update (moins lourd, on update sur demande en statut 2)
  public getStatsBatch() {
    this._campaignService.messagesStats(this.campaign._id).subscribe(result => {
      this._sizeA = result.batches[0].size;
      this._sizeB = result.batches[1].size;
      this._statsA = result.batches[0].stats;
      this._statsB = result.batches[1].stats;
      this.generateStatsTable();
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
    //TODO limit de float ?
    this._tableB = {
      _selector: 'TODO',
      _title: this._nameWorkflowB,
       _isNotPaginable: true,
      _content: [
        {
          Step: ' 1er mail',
          Delivered: (this._statsB[0].delivered  / this._sizeB) * 100 + '%',
          Opened: (this._statsB[0].opened / this._sizeB) * 100 + '%',
          Clicked: (this._statsB[0].clicked / this._sizeB) * 100 + '%',
          Insights: (this._statsB[0].insights / this._sizeB) * 100 + '%',
        }, {
          Step: ' 2eme mail',
          Delivered: (this._statsB[1].delivered / this._sizeB) * 100 + '%',
          Opened: (this._statsB[1].opened / this._sizeB) * 100 + '%',
          Clicked: (this._statsB[1].clicked / this._sizeB) * 100 + '%',
          Insights: (this._statsB[1].insights / this._sizeB) * 100 + '%',
        }, {
          Step: ' 3eme mail',
          Delivered: (this._statsB[2].delivered / this._sizeB) * 100 + '%',
          Opened: (this._statsB[2].opened / this._sizeB) * 100 + '%',
          Clicked: (this._statsB[2].clicked / this._sizeB) * 100 + '%',
          Insights: (this._statsB[2].insights / this._sizeB) * 100 + '%',
        }],
      _total: this._sizeB,
      _columns: [{
        _attr: 'Step',
        _name: 'Step',
        _type: 'TEXT'
      }, {
        _attr: 'Delivered',
        _name: 'Delivered',
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
      }]
    };


    this._tableA = {
      _selector: 'TODO',
      _title: this._nameWorkflowA,
      _isNotPaginable: true,
      _content: [{
          Step: ' 1er mail',
          Delivered: (this._statsA[0].delivered / this._sizeA) * 100 + '%',
          Opened: (this._statsA[0].opened / this._sizeA) * 100 + '%',
          Clicked: (this._statsA[0].clicked / this._sizeA) * 100 + '%',
          Insights: (this._statsA[0].insights / this._sizeA) * 100 + '%',
        }, {
        Step: ' 2eme mail',
          Delivered: (this._statsA[1].delivered / this._sizeA) * 100 + '%',
          Opened: (this._statsA[1].opened / this._sizeA) * 100 + '%',
          Clicked: (this._statsA[1].clicked / this._sizeA) * 100 + '%',
          Insights: (this._statsA[1].insights / this._sizeA) * 100 + '%',
        }, {
        Step: ' 3eme mail',
          Delivered: (this._statsA[2].delivered / this._sizeA) * 100 + '%',
          Opened: (this._statsA[2].opened / this._sizeA) * 100 + '%',
          Clicked: (this._statsA[2].clicked / this._sizeA) * 100 + '%',
          Insights: (this._statsA[2].insights / this._sizeA) * 100 + '%',
        }],
      _total: this._sizeA,
      _columns: [{
        _attr: 'Step',
        _name: 'Step',
        _type: 'TEXT'
      }, {
        _attr: 'Delivered',
        _name: 'Delivered',
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
  get tableA(): Table {return this._tableA};
  get tableB(): Table {return this._tableB};


  set nameWorkflowA(arg: string) { this._nameWorkflowA = arg};
  set nameWorkflowB(arg: string) { this._nameWorkflowB = arg};
  set sizeA(arg: number) { this._sizeA = arg};
  set sizeB(arg: number) { this._sizeB = arg};

}
