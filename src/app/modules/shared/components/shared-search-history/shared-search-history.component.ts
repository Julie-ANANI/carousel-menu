import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
import { Config } from '../../../../models/config';
import { Table } from '../../../table/models/table';
import { SidebarInterface } from '../../../sidebars/interfaces/sidebar-interface';
import { COUNTRIES } from '../shared-search-pros/COUNTRIES';
import { countries } from '../../../../models/static-data/country';
import { Campaign } from '../../../../models/campaign';
import { ProfessionalsService } from '../../../../services/professionals/professionals.service';
import { Router } from '@angular/router';
import { ConfigService } from '../../../../services/config/config.service';
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { GeographySettings } from '../../../../models/innov-settings';
import { IndexService } from '../../../../services/index/index.service';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { RolesFrontService } from '../../../../services/roles/roles-front.service';
import { ErrorFrontService } from '../../../../services/error/error-front.service';

@Component({
  selector: 'app-shared-search-history',
  templateUrl: './shared-search-history.component.html',
  styleUrls: ['./shared-search-history.component.scss']
})

export class SharedSearchHistoryComponent implements OnInit {

  @Input() accessPath: Array<string> = [];

  @Input() status = '';

  @Input() mails = false;

  @Input() set campaignId(value: string) {
    if (!!this._campaignId && value !== this._campaignId) {
      this._campaignId = value;
      this._initData();
    } else {
      this._campaignId = value;
    }
  }

  private _sidebarValue: SidebarInterface = {};

  private _tableInfos: Table = <Table>{};

  private _selectedRequest: any = null;

  private _requestsToImport: Array<any> = [];

  private _paused = false;

  private _requests: Array<any> = [];

  private _suggestedKeywords: Array<string> = [];

  private _total = -1;

  private _totalPros = 0;

  private _googleQuota = 100000;

  private _waitingTime = 0; // in minutes


  private _config: Config = {
    fields: 'entity region keywords created country elapsedTime status countries cost flag campaign ' +
      'innovation motherRequest totalResults metadata results',
    limit: this._configService.configLimit('admin-search-history-limit'),
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }',
    recycled: 'false',
  };

  private _chosenCampaign: Campaign = null;

  private _launchNewRequests = false;

  private _addToCampaignModal = false;

  private _geography: GeographySettings = <GeographySettings>{};

  private _campaignId = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _router: Router,
              private _configService: ConfigService,
              private _campaignService: CampaignService,
              private _searchService: SearchService,
              private _rolesFrontService: RolesFrontService,
              private _professionalsService: ProfessionalsService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _indexService: IndexService) { }

  ngOnInit(): void {
    this._initTable();
    this._initData();
  }

  private _initData() {
    if (isPlatformBrowser(this._platformId)) {
      // On récupère le quota Google
      this._getGoogleQuota();

      if (this._campaignId) {
        this._config.campaign = this._campaignId;
      }

      if (this.mails) {
        this._config.entity = 'MAIL_ADDRESS';
      } else {
        if (this.status) {
          this._config.entity = 'PERSON';
        } else {
          this._config.motherRequest = 'null';
        }
      }

      if (this.status) {
        this._config.status = this.status;
      }

      this._loadHistory();

    }
  }

  private static _getRequestIndex(requestId: string, array: Array<any>): number {
    for (const request of array) {
      if (requestId === request._id) {
        return array.indexOf(request);
      }
    }
  }

  private _loadHistory() {
    this._suggestedKeywords = [];
    this._searchService.getRequests(this._config).pipe(first()).subscribe((result: any) => {

      if (result.requests) {
        this._requests = result.requests.map((request: any) => {
          request.pros = (request.results.person.length || request.totalResults || 0) + ' pros';
          if (request.status === 'QUEUED' || request.status === 'PROCESSING') {
            this._waitingTime ++;
          }
          if (request.region) {
            request.targetting = request.region;
            request.keywords = request.keywords.replace(`"${request.region}"`, '');
          } else if (request.country) {
            request.targetting = countries[request.country];
          } else if (request.countries && request.countries.length) {
            request.targetting = '';
            const counter: {[c: string]: number} = {EU: 0, NA: 0, SA: 0, AS: 0, AF: 0, OC: 0};
            request.countries.forEach((country: string) => {
              if (COUNTRIES.europe.indexOf(country) !== - 1) { counter.EU++; }
              else if (COUNTRIES.americaNord.indexOf(country) !== - 1) { counter.NA++; }
              else if (COUNTRIES.americaSud.indexOf(country) !== - 1) { counter.SA++; }
              else if (COUNTRIES.asia.indexOf(country) !== - 1) { counter.AS++; }
              else if (COUNTRIES.africa.indexOf(country) !== - 1) { counter.AF++; }
              else if (COUNTRIES.oceania.indexOf(country) !== - 1) { counter.OC++; }
            });
            for (const key of Object.keys(counter)) {
              if (counter[key]) { request.targetting += ` ${key}(${counter[key]})`; }
            }
          }
          return request;
        });
      }
        this._waitingTime = (610 * this._waitingTime) / 60000;  // 610 = average processing time in ms for one request, we set it so we doesnt have to compute it each time this page load
        if (result._metadata) {
          this._total = result._metadata.totalCount;
          this._paused = result._metadata.paused;
        }
        this._initTable();

      }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  private _initTable() {
    this._tableInfos = {
      _selector: 'admin-search-history-limit',
      _title: 'searches',
      _content: this._requests,
      _total: this._total,
      _clickIndex: this.canAccess(['view', 'request']) ? 1 : null,
      _isSearchable: this.canAccess(['searchBy', 'keywords']),
      _isPaginable: true,
      _isSelectable: true,
      _isTitle: this._total !== 10000,
      _isNoMinHeight: this._total < 11,
      _buttons: [
        {
          _icon: 'fas fa-times',
          _label: 'Pause the requests',
          _colorClass: 'text-alert',
          _isHidden: !this.canAccess(['stop', 'requests'])
        },
        {
          _icon: 'fas fa-times',
          _label: 'Cancel the requests',
          _isHidden: !this.canAccess(['cancel', 'requests'])
        },
        {
          _icon: 'fas fa-hourglass-half',
          _label: 'Put back in queue',
          _isHidden: !this.canAccess(['putBackInQueue'])
        },
        {
          _icon: 'fas fa-share-square',
          _label: 'Add to campaign',
          _isHidden: !this.canAccess(['add', 'toCampaign'])
        },
        {
          _icon: 'fas fa-envelope',
          _label: 'Search emails',
          _isHidden: !this.canAccess(['launch', 'emailsSearch'])
        }
      ],
      _columns: [
        {
          _attrs: ['keywords'],
          _name: 'Keywords',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'keywords']),
          _isHidden: !this.canAccess(['tableColumns', 'keywords']),
          _isSortable: false
        },
        {
          _attrs: ['pros'],
          _name: 'Pros',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'pros'])
        },
        {
          _attrs: ['targetting'],
          _name: 'Targeting',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'targeting'])
        },
        {
          _attrs: ['created'],
          _name: 'Created',
          _type: 'DATE',
          _isSortable: true,
          _width: '120px',
          _isHidden: !this.canAccess(['tableColumns', 'created'])
        },
        {
          _attrs: ['status'],
          _name: 'Pro identification',
          _type: 'MULTI-CHOICES',
          _isHidden: !this.canAccess(['tableColumns', 'status']),
          _choices: [
            {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
            {_name: 'PROCESSING', _alias: 'Processing', _class: 'label is-progress'},
            {_name: 'QUEUED', _alias: 'Queued', _class: 'label is-danger'},
            {_name: 'CANCELED', _alias: 'Canceled', _class: 'label is-danger'}
          ]},
        {
          _attrs: ['flag'],
          _name: 'Email reconstruction',
          _type: 'MULTI-CHOICES',
          _isHidden: !this.canAccess(['tableColumns', 'emailStatus']),
          _enableTooltip: true,
          _choices: [
            {_name: 'PROS_ADDED', _alias: 'Pros added', _class: 'label is-success'},
            {_name: 'EMAILS_FOUND', _alias: 'Found', _class: 'label is-success'},
            {_name: 'EMAILS_SEARCHING', _alias: 'Searching', _class: 'label is-progress'},
            {_name: 'EMAILS_QUEUED', _alias: 'Queued', _class: 'label is-danger'}
          ]},
        {
          _attrs: ['metadata.shield'],
          _name: 'Under shield',
          _type: 'TEXT',
          _width: '150px',
          _isHidden: !this.canAccess(['tableColumns', 'underShield']),
          _isSortable: true
        },
        {
          _attrs: ['metadata.ambassadors'],
          _name: 'Ambassadors',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'ambassador']),
          _isSortable: true
        },
      ]
    };
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(this.accessPath.concat(path));
  }

  public openSidebar(request: any) {
    this._selectedRequest = request;
    this._sidebarValue = {
      animate_state: 'active',
      title: request.keywords,
      size: '850px'
    };
  }

  public updateInnovation(object: any) {
    if (object.value.length) {
      this._config.innovation = JSON.stringify({
        '$in': object.value.map((v: any) => v._id)
      });
    } else {
      delete this._config.innovation;
    }
    this._loadHistory();
  }

  public onClickActions(value: any) {
    const requestsIds = value._rows.map((r: any) => r._id);

    if (value._action === 'Cancel the requests') {

      this._searchService.cancelManyRequests(requestsIds).pipe(first()).subscribe((_: any) => {
        requestsIds.forEach((requestId: string) => {
          this._requests[SharedSearchHistoryComponent._getRequestIndex(requestId, this._requests)].status = 'CANCELED';
        });
        this._translateNotificationsService.success('Success', 'The requests have been cancelled.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });

    } else if (value._action === 'Put back in queue') {

      this._searchService.queueManyRequests(requestsIds).pipe(first()).subscribe((_: any) => {
        requestsIds.forEach((requestId: string) => {
          const request = this._requests[SharedSearchHistoryComponent._getRequestIndex(requestId, this._requests)];
          if (request.status !== 'DONE') { request.status = 'QUEUED'; }
        });
        this._translateNotificationsService.success('Success', 'The queries have been put on hold.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    } else if (value._action === 'Pause the requests') {

      this._searchService.stopManyRequests(requestsIds).pipe(first()).subscribe((_: any) => {
        requestsIds.forEach((requestId: string) => {
          const request = this._requests[SharedSearchHistoryComponent._getRequestIndex(requestId, this._requests)];
          request.status = 'DONE';
        });
        this._translateNotificationsService.success('Success', 'The requests have been paused.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });

    }  else if (value._action === 'Search emails') {
      requestsIds.forEach((requestId: string, index: number) => {
        const params: any = {
          requestId: requestId,
          query: {
            motherRequestId: requestId
          },
          all: true
        };

        this._searchService.searchMails(params).pipe(first()).subscribe((result: any) => {
          if (index === requestsIds.length - 1) {
            this._translateNotificationsService.success('Success',
              `The search for e-mails has been launched.`);
          }
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          console.error(err);
        });
      });
    } else {
      this._requestsToImport = requestsIds;
      this._totalPros = value._rows.reduce((acc: number, curr: any) => {
        const nbPros = curr.totalResults || curr.results.person.length || 0;
        return acc + nbPros;
      }, 0);
      this._addToCampaignModal = true;
    }
  }

  public updateCampaign(event: any) {
    if (Array.isArray(event.value)) {
      if (event.value.length > 0) {
        this._campaignService.get(event.value[0]._id).pipe(first()).subscribe((campaign) => {
          this._geography = campaign.innovation.settings.geography;
          this._chosenCampaign = campaign;
        }, (err: HttpErrorResponse) => {
          console.error(err);
        });
      } else {
        this._chosenCampaign = undefined;
      }
    }
  }

  public addToCampaign(campaign: Campaign, goToCampaign?: boolean) {
    this._addToCampaignModal = false;
    const params: any = {
      newCampaignId: campaign._id,
      newInnovationId: campaign.innovation._id,
      requestIds: this._requestsToImport,
      launchNewRequests: this._launchNewRequests,
      newTargetCountries: this._geography.include.map((country) => country.code)
    };
    this._totalPros = 0;
    this._professionalsService.addFromHistory(params).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Success',
        'The pros will be on the move in a few minutes.');
      if (goToCampaign) {
        this._router.navigate([
          `/user/admin/projects/project/${campaign.innovation._id}/preparation/campaigns/campaign/${campaign._id}/pros`
        ]);
      }
      this._requestsToImport = [];
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public relaunchRequests() {
    this._searchService.relaunchRequests().pipe(first()).subscribe((_: any) => {
      this._loadHistory();
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  private _getGoogleQuota() {
    this._searchService.dailyStats().pipe(first()).subscribe((result: any) => {
      this._googleQuota = 100000;
      if (result.hours) {
        this._googleQuota -= result.hours.slice(7).reduce((sum: number, hour: any) => sum + hour.googleQueries, 0);
      }
    }, (err: HttpErrorResponse) => {
      console.error(err);
    });
  }

  private _keywordsSuggestion(query: string) {
    const byCount = function(array: Array<any>) {
      let itm, a = [], L = array.length, o = {};
      for (let i = 0; i < L; i++) {
        itm = array[i];
        if (!itm) {continue; }
        if (o[itm] === undefined) {o[itm] = 1; } else {++o[itm]; }
      }
      for (const p in o) {a[a.length] = p; }
      return a.sort(function(a, b) {
        return o[b] - o[a];
      });
    };

    let tmp: Array<any> = [];
    const kw: Array<string> = [];
    this._indexService.find(query, 'requests').subscribe((res) => {
      res['requests'].forEach((request: object) => {
        this._suggestedKeywords.push('');
        tmp = request['_source']['keywords'].split('"');
        for (let i = 1; i < tmp.length; i += 2) {
          if (!(query.split('%20').includes(tmp[i]))) {
            kw.push(tmp[i]);
          }
        }
      });
      this._suggestedKeywords = byCount(kw).slice(0, 4) || [];
    });
  }

  get requests(): Array<any> {
    return this._requests;
  }

  get total(): number {
    return this._total;
  }

  get totalPros(): number {
    return this._totalPros;
  }

  get googleQuota(): number {
    return this._googleQuota;
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    const tmp = JSON.parse(value.search);
    this._loadHistory();
    if ('keywords' in tmp) {
      this._keywordsSuggestion(tmp['keywords']);
    }
  }

  get paused(): boolean {
    return this._paused;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get selectedRequest(): any {
    return this._selectedRequest;
  }

  get chosenCampaign(): Campaign {
    return this._chosenCampaign;
  }

  get addToCampaignModal(): boolean {
    return this._addToCampaignModal;
  }

  set addToCampaignModal(value: boolean) {
    this._addToCampaignModal = value;
  }

  get geography(): GeographySettings {
    return this._geography;
  }

  set geography(value: GeographySettings) {
    this._geography = value;
  }

  get suggestions(): Array<string> {
    return this._suggestedKeywords;
  }

  get launchNewRequests(): boolean {
    return this._launchNewRequests;
  }

  set launchNewRequests(value: boolean) {
    this._launchNewRequests = value;
  }

  get campaignId(): string {
    return this._campaignId;
  }

  get waitingTime(): number {
    return this._waitingTime;
  }

}
