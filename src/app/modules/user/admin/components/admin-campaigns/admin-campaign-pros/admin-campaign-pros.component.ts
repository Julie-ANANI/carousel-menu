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
  public importProsModal: Boolean = false;
  private _addProModal = false;
  private _campaign: Campaign;
  private _originCampaign: Array<Campaign> = [];
  private _contextSelectedPros: Array<any> = [];
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

  public selectedProsEvent(event: Event) {
    this._contextSelectedPros = event['pros'];
    console.log(this._contextSelectedPros);
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

  updateCampaign(event: any) {
    this._originCampaign = event.value;
  }

  exportPros() {
    const config = {
      professionals: [] || 'all',
      campaignId: this._campaign._id,
      query: {
        campaignId: this._campaign._id
      }
    };
    // Build a config according to the state, for example if there are selected pros, create a $in query...
    if( this._contextSelectedPros.length ) {
      config.professionals = this._contextSelectedPros.map(pro=>pro._id);
    }
    this._professionalsService.export(config).pipe(first()).subscribe((answer: any) => {
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
