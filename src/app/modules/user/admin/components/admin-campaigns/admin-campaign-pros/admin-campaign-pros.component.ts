import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { ProfessionalsService } from '../../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';
import { FormGroup } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';

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

  private _noResult = false;

  constructor(private activatedRoute: ActivatedRoute,
              private translateNotificationsService: TranslateNotificationsService,
              private professionalsService: ProfessionalsService,
              @Inject(PLATFORM_ID) private platform: Object,
              private campaignFrontService: CampaignFrontService) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];

    this._config = {
      fields: 'language firstName lastName company email emailConfidence country jobTitle personId messages campaigns',
      limit: '10',
      offset: '0',
      search: '{}',
      campaigns: this._campaign._id,
      sort: '{ "created": -1 }'
    };

    this.getProfessionals();

  }


  private getProfessionals() {
    this.professionalsService.getAll(this._config).pipe(first()).subscribe((response: any) => {
      this._noResult = response._metadata.totalCount === 0;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  getCampaignStat(searchKey: string): number {
    if (this._campaign) {
      return this.campaignFrontService.getProsCampaignStat(this._campaign, searchKey);
    }
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
      this._noResult = false;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  importPros(value: boolean) {
    if (value) {
      this.professionalsService.importProsFromCampaign(this._originCampaign[0]._id, this._campaign._id, this._originCampaign[0].innovation.toString(), this._campaign.innovation._id)
        .pipe(first()).subscribe((answer: any) => {
          const message = `${answer.nbProfessionalsMoved} pros ont été importés`;
          this.translateNotificationsService.success('ERROR.SUCCESS', message);
          this._noResult = false;
        }, () => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
        });
    }

    this._importModal = false;

  }


  updateCampaign(event: any) {
    this._originCampaign = event.value;
  }


  OnClickAdd(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.ADD_PRO',
      type: 'addPro'
    };

  }


  onClickSave(formValue: FormGroup) {
    this._newPro = {
      firstName: formValue.get('firstName').value,
      lastName: formValue.get('lastName').value,
      email: formValue.get('email').value,
      jobTitle: formValue.get('jobTitle').value,
      country: formValue.get('country').value,
      profileUrl: formValue.get('profileUrl').value,
      company: formValue.get('companyName').value,
      emailConfidence: 100
    };

    this.professionalsService.create([this._newPro], this.campaign._id, this.campaign.innovation._id)
      .subscribe((result: any) => {
        if (result.nbProfessionalsMoved) {
          this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.ADDED');
        } else {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ACCOUNT.NOT_ADDED');
        }
        this._noResult = false;
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });

  }


  public selectedProsEvent(event: {pros: Array<any>}) {
    this._contextSelectedPros = event.pros;
  }


  onClickExport(event: Event) {
    event.preventDefault();
    const config: any = {
      fields: 'language firstName lastName email emailConfidence profileUrl company urlCompany keywords country jobTitle messages',
      professionals: [],
      campaignId: this._campaign._id,
      query: {
        campaignId: this._campaign._id,
        search: ''
      }
    };

    config.query.search = this._config.search ? JSON.parse(this._config.search) : null;

    if ( this._contextSelectedPros.length ) {
      config.professionals = this._contextSelectedPros.map(pro => pro._id);
    } else {
      config.professionals = 'all';
    }

    this.professionalsService.export(config).subscribe((answer: any) => {
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

  get noResult(): boolean {
    return this._noResult;
  }

}
