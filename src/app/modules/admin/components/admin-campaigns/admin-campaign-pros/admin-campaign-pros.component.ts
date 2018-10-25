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
  public importProsModal: Boolean = false;
  private _addProModal = false;
  private _campaign: Campaign;
  private _originCampaign: Array<Campaign> = [];
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

  importPros() {
    this._professionalsService.importProsFromCampaign(
      this._originCampaign[0]._id,
      this._campaign._id,
      this._originCampaign[0].innovation.toString(),
      this._campaign.innovation._id
    ).first().subscribe((answer: any) => {
      this._originCampaign = [];
      const message = `${answer.nbProfessionalsMoved} pros ont été importés`;
      this._notificationsService.success('ERROR.SUCCESS', message);
    });
  }

  updateCampaign(event: any) {
    this._originCampaign = event.value;
  }

  exportPros() {
    const config = {
      professionals: 'all',
      campaignId: this._campaign._id,
      query: {
        campaignId: this._campaign._id
      }
    };
    this._professionalsService.export(config).first().subscribe((answer: any) => {
      const blob = new Blob([answer.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  get addProModal(): boolean  { return this._addProModal; }
  set config(value: any) { this._config = value; }
  get config(): any { return this._config; }
  get campaign(): Campaign { return this._campaign; }
  get originCampaign(): Array<Campaign> { return this._originCampaign; }
}
