import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { ProfessionalsService } from '../../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
import { SidebarInterface } from '../../../../../sidebar/interfaces/sidebar-interface';
import { isPlatformBrowser } from '@angular/common';
import { Professional } from '../../../../../../models/professional';
import { Config } from '../../../../../../models/config';
import { TranslateTitleService } from '../../../../../../services/title/title.service';
import { Response } from '../../../../../../models/response';
import { ConfigService } from '../../../../../../services/config/config.service';

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-admin-campaign-pros',
  templateUrl: './admin-campaign-pros.component.html',
  styleUrls: ['./admin-campaign-pros.component.scss']
})

export class AdminCampaignProsComponent implements OnInit {

  private _config: Config = {
    fields: 'language firstName lastName company email emailConfidence country jobTitle personId messages campaigns',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  private _campaign: Campaign;

  private _professionals: Array<SelectedProfessional> = [];

  private _total: number = -1;

  private _fetchingError: boolean;

  private _noResult: boolean;

  private _modalImport = false;

  private _originCampaign: Array<Campaign> = [];

  private _sidebarValue: SidebarInterface = {};

  private _newPro: Professional = {
    firstName: '',
    lastName: '',
    email: '',
    emailConfidence: 100,
    jobTitle: '',
    company: '',
    country: '',
    profileUrl: ''
  };

  private _contextSelectedPros: Array<any> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _professionalsService: ProfessionalsService,
              private _configService: ConfigService) {

    this._translateTitleService.setTitle('Professionals | Campaign');

    if (this._activatedRoute.snapshot.parent.data['campaign']) {
      this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
      this._config.campaigns = this._campaign ? this._campaign._id : '';
    }

  }

  ngOnInit() {

    if (isPlatformBrowser(this._platformId)) {

      this._config.limit = this._configService.configLimit('admin-campaign-pros-limit');

      this._professionalsService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
        this._professionals = response.result;
        this._total = response._metadata.totalCount;
        this._noResult = this._total === 0;
      }, () => {
        this._fetchingError = true;
      });

    }

  }

  private _getProfessionals() {
    this._professionalsService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._professionals = response.result;
      this._total = response._metadata.totalCount;
      this._noResult = this._config.search.length > 2 || this._config.status ? false : this._total === 0;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }

  public onClickAdd() {
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.ADD_PRO',
      type: 'addPro'
    };
  }

  public onClickImport() {
    this._modalImport = true;
  }

  public updateCampaign(event: any) {
    this._originCampaign = event.value;
  }

  public onClickImportCsv(file: File) {
    this._professionalsService.importProsFromCsv(this._campaign._id, this._campaign.innovation._id, file).pipe(first()).subscribe((res: any) => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.IMPORT.CSV');
      this._getProfessionals();
      this._modalImport = false;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public onClickConfirm() {
    this._professionalsService.importProsFromCampaign(this._originCampaign[0]._id, this._campaign._id,
      this._originCampaign[0].innovation.toString(), this._campaign.innovation._id).pipe(first()).subscribe((answer: any) => {
      const message = `${answer.nbProfessionalsMoved} pros ont été importés`;
      this._translateNotificationsService.success('ERROR.SUCCESS', message);
      this._getProfessionals();
      this._modalImport = false;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public onClickSave(value: Professional) {

    this._newPro = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      jobTitle: value.jobTitle,
      country: value.country,
      profileUrl: value.profileUrl,
      company: value.company,
      emailConfidence: 100
    };

    this._professionalsService.create([this._newPro], this._campaign._id, this._campaign.innovation._id)
      .pipe(first()).subscribe((result: any) => {
        if (result.nbProfessionalsMoved) {
          this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.ADDED');
        } else {
          this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.ACCOUNT.NOT_ADDED');
        }
        this._getProfessionals();
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
      });

  }

  public onClickExport() {
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

    this._professionalsService.export(config).pipe(first()).subscribe((answer: any) => {
      const blob = new Blob([answer.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      if (isPlatformBrowser(this._platformId)) {
        window.open(url);
      }

    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });

  }

  public selectedProsEvent(value: {total: number, pros: Array<any>}) {
    this._contextSelectedPros = value.pros;
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    this._getProfessionals();
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get professionals(): Array<SelectedProfessional> {
    return this._professionals;
  }

  get total(): number {
    return this._total;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get noResult(): boolean {
    return this._noResult;
  }

  get modalImport(): boolean {
    return this._modalImport;
  }

  set modalImport(value: boolean) {
    this._modalImport = value;
  }

  get originCampaign(): Array<Campaign> {
    return this._originCampaign;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get newPro(): Professional {
    return this._newPro;
  }

}
