import { Component, OnInit, Input } from '@angular/core';
import { EmailScenario } from '../../../../../models/email-scenario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Campaign } from '../../../../../models/campaign';

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

  private _campaign: Campaign;
  private _status: number;
  private _modifiedScenarios: Array<EmailScenario> ;
  private _nameWorkflowA = '';
  private _nameWorkflowB = '';
  private _sizeA: number;
  private _sizeB: number;

  private _statsA: {
    delivered: number,
    opened: number,
    clicked: number,
    insights: number,
    bounced: number
  };
  private _statsB: {
    delivered: number,
    opened: number,
    clicked: number,
    insights: number,
    bounced: number
  };

  form: FormGroup;

  public switchActivated: Boolean = false;

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
    this._statsA = defAB;
    this._statsB = defAB;

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

    if (this.campaign.settings.ABsettings.status > 0) {
      this.updateStatsBatch();
    }
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
    if (this.sizeA + this.sizeB > this.campaign.stats.nbPros90) {
      if (this.sizeA > this.sizeB) {
        this.sizeA = this.campaign.stats.nbPros90 - this.sizeB
      }
      else {
        this.sizeB = this.campaign.stats.nbPros90 - this.sizeA
      }
    }
    this._campaignService.startABtesting(this.campaign._id, this.nameWorkflowA, this.nameWorkflowB, this.sizeA, this.sizeB)
      .subscribe((obj: Array<any>) => {
      if (obj.length === 0) {
        this._notificationsService.error('ERROR.ERROR', 'Not enough Pros in campaign');
      } else {
        this._status = 1;
        this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
      }
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }

  public stopABtesting() {

  }

  public statusSwitch() {
    this.switchActivated = !this.switchActivated;
    if (this.switchActivated) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }


  public updateStatsBatch() {
    this._campaignService.updateBatchStats(this.campaign.settings.ABsettings.batchA).subscribe((obj: any) => {
      if (obj.length === 0) {
        this._notificationsService.error('ERROR.ERROR', 'No event detected yet');
      } else {
        this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
        this._statsA = obj;
      }
    });
    this._campaignService.updateBatchStats(this.campaign.settings.ABsettings.batchB).subscribe((obj: any) => {
      if (obj.length === 0) {
        this._notificationsService.error('ERROR.ERROR', 'No event detected yet');
      } else {
        this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
        this._statsB = obj;
      }
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


  set nameWorkflowA(arg: string) { this._nameWorkflowA = arg};
  set nameWorkflowB(arg: string) { this._nameWorkflowB = arg};
  set sizeA(arg: number) { this._sizeA = arg};
  set sizeB(arg: number) { this._sizeB = arg};

}
