import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { ProfessionalsService } from '../../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Professional } from '../../../../../../models/professional';
import { first } from 'rxjs/operators';

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

  private _importModal = false;

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
      limit: '10',
      offset: '0',
      search: '{}',
      campaigns: this._campaign._id,
      sort: '{ "created: -1" }'
    };

  }


  getCampaignStat(searchKey: string): number {
    let value = 0;

    switch (searchKey) {

      case 'professional':
        value = this._campaign.stats.nbPros;
        break;

      case 'notReached':
        value = Math.round(((this._campaign.stats.nbPros - this._campaign.stats.nbProsSent) / this._campaign.stats.nbPros) * 100);
        break;

      case 'good':
        value = Math.round((this._campaign.stats.campaign.nbFirstTierMails / this._campaign.stats.nbPros) * 100);
        break;

      case 'unsure':
        value = Math.round((this._campaign.stats.campaign.nbSecondTierMails / this._campaign.stats.nbPros) * 100);
        break;

      case 'bad':
        value = Math.round(((this._campaign.stats.nbPros - (this._campaign.stats.campaign.nbFirstTierMails + this._campaign.stats.campaign.nbSecondTierMails ))/ this._campaign.stats.nbPros) * 100);
        break;

      default:
      // do nothing...

    }

    return isNaN(value) ? 0 : value;
  }

  onClickImport(event: Event) {
    event.preventDefault();
    this._importModal = true;
  }


  updateCampaign(event: any) {
    this._originCampaign = event.value;
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
      this._professionalsService
        .create([this.newPro], this.campaign._id, this.campaign.innovation._id)
        .pipe(first())
        .subscribe((createdPro: Professional) => {
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
    ).pipe(first()).subscribe((answer: any) => {
      this.importProsModal = false;
      const message = `${answer.nbProfessionalsMoved} pros ont été importés`;
      this._notificationsService.success('ERROR.SUCCESS', message);
    });
  }

  public importProsCsv(file: File, event: Event) {
    event.preventDefault();
    this._professionalsService.importProsFromCsv(this._campaign._id, this._campaign.innovation._id, file)
      .subscribe((res: any) => {
        this._notificationsService.success('ERROR.SUCCESS', res.message);
      }, (err: any) => {
        this._notificationsService.error('ERROR.ERROR', err.message);
      });
  }



  exportPros() {
    const config = {
      professionals: 'all',
      campaignId: this._campaign._id,
      query: {
        campaignId: this._campaign._id
      }
    };
    this._professionalsService.export(config).pipe(first()).subscribe((answer: any) => {
      const blob = new Blob([answer.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  get addProModal(): boolean  {
    return this._addProModal;
  }

  set config(value: any) {
    this._config = value;
  }

  get config(): any {
    return this._config;
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get originCampaign(): Array<Campaign> {
    return this._originCampaign;
  }

  get importModal(): boolean {
    return this._importModal;
  }

  set importModal(value: boolean) {
    this._importModal = value;
  }

}
