import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { ProfessionalsService } from '../../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { first, takeUntil } from 'rxjs/operators';
import { SidebarInterface } from '../../../../../sidebars/interfaces/sidebar-interface';
import { isPlatformBrowser } from '@angular/common';
import { Professional } from '../../../../../../models/professional';
import { Config } from '../../../../../../models/config';
import { Response } from '../../../../../../models/response';
import { ConfigService } from '../../../../../../services/config/config.service';
import { RolesFrontService } from "../../../../../../services/roles/roles-front.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorFrontService } from "../../../../../../services/error/error-front.service";
import { StatsInterface } from "../../admin-stats-banner/admin-stats-banner.component";
import { CampaignFrontService } from "../../../../../../services/campaign/campaign-front.service";
import { Subject } from 'rxjs';

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-admin-campaign-pros',
  templateUrl: './admin-campaign-pros.component.html',
  styleUrls: ['./admin-campaign-pros.component.scss']
})

export class AdminCampaignProsComponent implements OnInit, OnDestroy {

  private _config: Config = {
    fields: 'language firstName lastName company email emailConfidence country jobTitle personId messages campaigns',
    limit: this._configService.configLimit('admin-campaign-pros-limit'),
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  private _campaign: Campaign = <Campaign>{};

  private _professionals: Array<SelectedProfessional> = [];

  private _total = -1;

  private _modalImport = false;

  private _originCampaign: Array<Campaign> = [];

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

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

  private _isImporting = false;

  private _isExporting = false;

  private _isCreating = false;

  private _accessPath: Array<string> = ['projects', 'project', 'campaigns', 'campaign', 'pros'];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _rolesFrontService: RolesFrontService,
              private _campaignFrontService: CampaignFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _professionalsService: ProfessionalsService,
              private _configService: ConfigService) { }

  ngOnInit() {
    if (this._activatedRoute.snapshot.parent.data['campaign']
      && typeof this._activatedRoute.snapshot.parent.data['campaign'] !== undefined) {
      this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
      this._campaignFrontService.setActiveCampaign(this._campaign);
      this._campaignFrontService.setActiveCampaignTab('pros');
      this._initCampaign();
    }

    this._campaignFrontService.activeCampaign().pipe(takeUntil(this._ngUnsubscribe)).subscribe((campaign) => {
      if (!!campaign && this._campaign._id !== campaign._id) {
        this._campaign = campaign;
        this._initCampaign();
      }
    });

  }

  private _initCampaign() {
    this._config.campaigns = this._campaign ? this._campaign._id : '';
    this._getProfessionals();
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(this._accessPath.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
    }
  }

  private _getProfessionals() {
    if (isPlatformBrowser(this._platformId)) {
      this._professionalsService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
        this._professionals = response && response.result || [];
        this._total = response._metadata.totalCount || response.result.length;
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    }
  }

  public statsConfig(): Array<StatsInterface> {
    return [
      {
        heading: 'Pros',
        content: [
          {subHeading: 'Found', value: this._campaignStat('professional').toString(10)},
          {subHeading: 'Not reached', value: this._campaignStat('notReached').toString(10)},
          {subHeading: 'Stared', value: '--'},
          {subHeading: 'Duplicated', value: '--'}
        ]
      },
      {
        heading: 'Emails',
        content: [
          {subHeading: 'Good', value: this._campaignStat('good') + '%'},
          {subHeading: 'Unsure', value: this._campaignStat('unsure') + '%'},
          {subHeading: 'Bad', value: this._campaignStat('bad') + '%'},
        ]
      },
      {
        heading: 'Cost',
        content: [
          {subHeading: 'Requested', value: '--'},
          {subHeading: 'Emails', value: '--'},
        ]
      }
    ];
  }

  private _campaignStat(searchKey: string): number {
    return CampaignFrontService.getBatchCampaignStat(this._campaign, searchKey);
  }

  public onClickAdd() {
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Add Professional',
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
    if (!this._isImporting) {
      this._isImporting = true;
      this._professionalsService.importProsFromCsv(this._campaign._id, this._campaign.innovation._id, file).pipe(first())
        .subscribe((res: any) => {
          this._getProfessionals();
          this._modalImport = false;
          this._isImporting = false;
          this._translateNotificationsService.success('Success', 'The CSV is imported.');
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          this._isImporting = false;
          console.error(err);
        });
    }
  }

  public onClickConfirm() {
    if (!this._isImporting) {
      this._isImporting = true;
      this._professionalsService.importProsFromCampaign(this._originCampaign[0]._id, this._campaign._id,
        this._originCampaign[0].innovation.toString(), this._campaign.innovation._id).pipe(first())
        .subscribe((answer: any) => {
          this._getProfessionals();
          const message = `${answer.nbProfessionalsMoved} pros are imported.`;
          this._translateNotificationsService.success('Success', message);
          this._modalImport = false;
          this._isImporting = false;
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          this._isImporting = false;
          console.error(err);
        });
    }
  }

  public onClickSave(value: Professional) {
    if (!this._isCreating) {
      this._isCreating = true;

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
        this._getProfessionals();
        this._isCreating = false;
        if (result.nbProfessionalsMoved) {
          this._translateNotificationsService.success('Success', 'The professional is added.');
        } else {
          this._translateNotificationsService.error('Error', 'The profile is not added. ' +
            'It may belong to another campaign of the project, or maybe blacklisted.');
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isCreating = false;
        console.error(err);
      });

    }
  }

  public onClickExport() {
    if (!this._isExporting) {
      this._isExporting = true;

      const _config: any = {
        fields: 'language firstName lastName email emailConfidence profileUrl company urlCompany keywords country ' +
          'jobTitle messages',
        professionals: [],
        campaignId: this._campaign._id,
        query: {
          campaignId: this._campaign._id,
          search: ''
        }
      };

      _config.query.search = this._config.search ? JSON.parse(this._config.search) : null;

      if ( this._contextSelectedPros.length ) {
        _config.professionals = this._contextSelectedPros.map(pro => pro._id);
      } else {
        _config.professionals = 'all';
      }

      this._professionalsService.export(_config).pipe(first()).subscribe((answer: any) => {
        const _blob = new Blob([answer.csv], { type: 'text/csv' });
        const _url = window.URL.createObjectURL(_blob);
        this._isExporting = false;
        this._translateNotificationsService.error('Success', 'The professionals are exported.');
        if (isPlatformBrowser(this._platformId)) {
          window.open(_url);
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isExporting = false;
        console.error(err);
      });
    }
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

  get isImporting(): boolean {
    return this._isImporting;
  }

  get isExporting(): boolean {
    return this._isExporting;
  }

  get isCreating(): boolean {
    return this._isCreating;
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
