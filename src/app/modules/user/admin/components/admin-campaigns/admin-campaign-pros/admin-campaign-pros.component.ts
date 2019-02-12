import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { ProfessionalsService } from '../../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Professional } from '../../../../../../models/professional';
import { first } from 'rxjs/operators';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';
import { FormGroup } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-admin-campaign-pros',
  templateUrl: './admin-campaign-pros.component.html',
  styleUrls: ['./admin-campaign-pros.component.scss']
})

export class AdminCampaignProsComponent implements OnInit {

  private _newPro: any = {
    firstName: '',
    lastName: '',
    email: '',
    emailConfidence: 100,
    jobTitle: '',
    company: '',
    country: '',
    profileUrl: ''
  };

  private _importModal = false;

  private _campaign: Campaign;

  private _originCampaign: Array<Campaign> = [];

  private _contextSelectedPros: Array<any> = [];

  private _config: any;

  private _sidebarValue: SidebarInterface = {};

  constructor(private activatedRoute: ActivatedRoute,
              private translateNotificationsService: TranslateNotificationsService,
              private professionalsService: ProfessionalsService,
              @Inject(PLATFORM_ID) private platform: Object) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];

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


  OnClickImportCsv(file: File, event: Event) {
    event.preventDefault();

    this.professionalsService.importProsFromCsv(this._campaign._id, this._campaign.innovation._id, file).pipe(first()).subscribe((res: any) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.IMPORT.CSV');
      this._importModal = false;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  importPros(value: boolean) {
    if (value) {
      this.professionalsService.importProsFromCampaign(this._originCampaign[0]._id, this._campaign._id, this._originCampaign[0].innovation.toString(), this._campaign.innovation._id).pipe(first())
        .subscribe((answer: any) => {
          const message = `${answer.nbProfessionalsMoved} pros ont été importés`;
          this.translateNotificationsService.success('ERROR.SUCCESS', message);
        }, () => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
        });
    }
  }

  updateCampaign(event: any) {
    this._originCampaign = event.value;
  }


  OnClickAdd(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'COMMON.ADD_PRO',
      type: 'addPro'
    };

  }


  onClickSave(formValue: FormGroup) {
    this._newPro = {
      firstName: formValue['firstName'],
      lastName: formValue['lastName'],
      email: formValue['email'],
      jobTitle: formValue['jobTitle'],
      country: formValue['country'],
      profileUrl: formValue['profileUrl'],
      company: formValue['companyName'],
      emailConfidence: 100
    };

    this.professionalsService.create([this._newPro], this.campaign._id, this.campaign.innovation._id).pipe(first()).subscribe((createdPro: Professional) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.ADDED');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  public selectedProsEvent(event: Event) {
    this._contextSelectedPros = event['pros'];
    console.log(this._contextSelectedPros);
  }


  onClickExport() {
    const config = {
      professionals: [] || 'all',
      campaignId: this._campaign._id,
      query: {
        campaignId: this._campaign._id,
        search: ""
      }
    };

    config.query.search = this._config.search ? JSON.parse(this._config.search) : null;
    if( this._contextSelectedPros.length ) {
      config.professionals = this._contextSelectedPros.map(pro => pro._id);
    } else {
      config.professionals = 'all';
    }
    this.professionalsService.export(config).pipe(first()).subscribe((answer: any) => {
      const blob = new Blob([answer.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      if (isPlatformBrowser(this.platform)) { window.open(url); }
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

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

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get newPro(): any {
    return this._newPro;
  }

}
