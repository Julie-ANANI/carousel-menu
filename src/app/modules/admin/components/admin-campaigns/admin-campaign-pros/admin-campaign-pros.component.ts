import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { ProfessionalsService } from '../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { Professional } from '../../../../../models/professional';

@Component({
  selector: 'app-admin-campaign-pros',
  templateUrl: './admin-campaign-pros.component.html',
  styleUrls: ['./admin-campaign-pros.component.scss']
})
export class AdminCampaignProsComponent implements OnInit {

  public newPro: any = {
    firstName: '',
    lastName: '',
    email: '',
    emailConfidence: 100
  };
  private _addProModal = false;
  private _campaign: Campaign;
  private _config: any;

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationsService: TranslateNotificationsService,
              private _professionalsService: ProfessionalsService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this._config = {
      fields: 'language firstName lastName company email emailConfidence country jobTitle',
      limit: 10,
      offset: 0,
      search: {},
      campaigns: this._campaign._id,
      sort: {
        created: -1
      }
    };
  }

  addPro(value: boolean) {
    this._addProModal = value;
    this.newPro = {
      firstName: '',
      lastName: '',
      email: '',
      emailConfidence: 100
    };
  }

  createPro() {
    if (this.newPro.email && (this.newPro.firstName && this.newPro.lastName)) {
      this._professionalsService.create([this.newPro], this.campaign._id, this.campaign.innovation._id).first().subscribe((createdPro: Professional) => {
        this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
      });
    }
  }

  exportPros() {
    const config = {
      professionals: "all",
      campaignId: this._campaign._id,
      query: {
        campaignId: this._campaign._id
      }
    };
    this._professionalsService.export(config).first().subscribe((answer: any) => {
      const blob = new Blob([answer.csv], { type: 'text/csv' });
      const url= window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  set addProModal(value: boolean) { this._addProModal = value; }
  get addProModal(): boolean  { return this._addProModal; }
  set config(value: any) { this._config = value; }
  get config() { return this._config; }
  get campaign() { return this._campaign; }
}
