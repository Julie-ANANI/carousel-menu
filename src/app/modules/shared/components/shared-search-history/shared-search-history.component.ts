import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
import { Config } from "../../../../models/config";
import { Table } from '../../../table/models/table';
import { SidebarInterface } from "../../../sidebar/interfaces/sidebar-interface";
import { COUNTRIES } from "../shared-search-pros/COUNTRIES";
import { countries } from '../../../../models/static-data/country';
import { Campaign } from "../../../../models/campaign";
import { ProfessionalsService } from "../../../../services/professionals/professionals.service";
import { Router } from "@angular/router";
import { ConfigService } from "../../../../services/config/config.service";
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { GeographySettings } from '../../../../models/innov-settings';
import { SharedWorldmapService } from '../shared-worldmap/services/shared-worldmap.service';
import { IndexService } from '../../../../services/index/index.service';

@Component({
  selector: 'app-shared-search-history',
  templateUrl: './shared-search-history.component.html',
  styleUrls: ['./shared-search-history.component.scss']
})
export class SharedSearchHistoryComponent implements OnInit {

  @Input() campaignId: string;
  @Input() status: string;
  @Input() mails: boolean;


  private _sidebarValue: SidebarInterface = {};
  private _tableInfos: Table;
  private _selectedRequest: any = null;
  private _requestsToImport: Array<any> = [];
  private _paused = false;
  private _requests: Array<any> = [];
  private _suggestedKeywords: Array<string> = [];
  private _total = 0;
  private _googleQuota = 30000;
  private _config: Config = {
    fields: 'entity region keywords created country elapsedTime status countries cost flag campaign innovation motherRequest totalResults metadata results',
    limit: "10",
    offset: "0",
    search: "{}",
    sort: '{ "created": -1 }'
  };
  private _chosenCampaign: Campaign;
  private _launchNewRequests: boolean = false;
  private _addToCampaignModal: boolean = false;
  private _geography: GeographySettings;

  constructor(
    private _router: Router,
    private _configService: ConfigService,
    private _campaignService: CampaignService,
    private _searchService: SearchService,
    private _professionalsService: ProfessionalsService,
    private _notificationsService: TranslateNotificationsService,
    private _indexService: IndexService
  ) {}

  ngOnInit(): void {
    // On récupère le quota Google
    this.getGoogleQuota();
    if (this.campaignId) {
      this._config.campaign = this.campaignId;
    }
    if (this.mails) {
      this.config.entity = 'MAIL_ADDRESS';
    } else {
      if (this.status) {
        this.config.entity = 'PERSON';
      } else {
        this.config.motherRequest = 'null';
      }
    }
    if (this.status) {
      this.config.status = this.status;
    }
    this._config.limit = this._configService.configLimit('admin-search-history-limit');
    this.loadHistory();
  }

  public loadHistory() {
    this._suggestedKeywords = [];
    this._searchService.getRequests(this._config)
      .pipe(first())
      .subscribe((result: any) => {
        if(result.requests) {
          this._requests = result.requests.map((request: any) => {
            request.pros = (request.results.person.length || request.totalResults || 0) + " pros";
            if (request.region) {
              request.targetting = request.region;
              request.keywords = request.keywords.replace(`"${request.region}"`, "");
            } else if (request.country) {
              request.targetting = countries[request.country];
            } else if (request.countries && request.countries.length) {
              request.targetting = "";
              const counter: {[c: string]: number} = {EU: 0, NA: 0, SA: 0, AS: 0, AF: 0, OC: 0};
              request.countries.forEach((country: string) => {
                if (COUNTRIES.europe.indexOf(country) != - 1) counter.EU++;
                else if (COUNTRIES.americaNord.indexOf(country) != - 1) counter.NA++;
                else if (COUNTRIES.americaSud.indexOf(country) != - 1) counter.SA++;
                else if (COUNTRIES.asia.indexOf(country) != - 1) counter.AS++;
                else if (COUNTRIES.africa.indexOf(country) != - 1) counter.AF++;
                else if (COUNTRIES.oceania.indexOf(country) != - 1) counter.OC++;
              });
              for (let key of Object.keys(counter)) {
                if (counter[key]) request.targetting += ` ${key}(${counter[key]})`;
              }
            }
            return request;
          });
        }
        if (result._metadata) {
          this._total = result._metadata.totalCount;
          this._paused = result._metadata.paused;
        }

        this._tableInfos = {
          _selector: 'admin-search-history-limit',
          _title: 'SEARCH.HISTORY.SEARCHES',
          _content: this._requests,
          _total: this._total,
          _editIndex: 1,
          _isSearchable: true,
          _isPaginable: true,
          _isSelectable: true,
          _isTitle: true,
          _buttons: [
            { _icon: 'fas fa-times', _label: 'SEARCH.HISTORY.CANCEL' },
            { _icon: 'fas fa-hourglass-half', _label: 'SEARCH.HISTORY.BACK_QUEUE' },
            { _icon: 'fas fa-times', _label: 'SEARCH.HISTORY.STOP' },
            { _icon: 'fas fa-share-square', _label: 'SEARCH.ADDTOCAMPAIGN' },
            { _icon: 'fas fa-envelope', _label: 'SEARCH.HISTORY.SEARCH_MAILS' }
          ],
          _columns: [
            {_attrs: ['keywords'], _name: 'SEARCH.HISTORY.KEYWORDS', _type: 'TEXT', _isSearchable: true, _isSortable: false},
            {_attrs: ['pros'], _name: '', _type: 'TEXT', _isSearchable: false, _isSortable: false},
            {_attrs: ['targetting'], _name: 'SEARCH.HISTORY.TARGETTING', _type: 'TEXT'},
            {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isSortable: true},
            {_attrs: ['status'], _name: 'SEARCH.HISTORY.STATUS', _type: 'MULTI-CHOICES', _choices: [
              {_name: 'DONE', _alias: 'SEARCH.HISTORY.DONE', _class: 'label is-success'},
              {_name: 'PROCESSING', _alias: 'SEARCH.HISTORY.PROCESSING', _class: 'label is-progress'},
              {_name: 'QUEUED', _alias: 'SEARCH.HISTORY.QUEUED', _class: 'label is-danger'},
              {_name: 'CANCELED', _alias: 'SEARCH.HISTORY.CANCELED', _class: 'label is-danger'}
            ]},
            {_attrs: ['flag'], _name: 'SEARCH.HISTORY.FLAG', _type: 'MULTI-CHOICES', _choices: [
                {_name: 'PROS_ADDED', _alias: 'SEARCH.HISTORY.PROS_ADDED', _class: 'label is-success'},
                {_name: 'EMAILS_FOUND', _alias: 'SEARCH.HISTORY.EMAILS_FOUND', _class: 'label is-success'},
                {_name: 'EMAILS_SEARCHING', _alias: 'SEARCH.HISTORY.EMAILS_SEARCHING', _class: 'label is-progress'},
                {_name: 'EMAILS_QUEUED', _alias: 'SEARCH.HISTORY.EMAILS_QUEUED', _class: 'label is-danger'}
              ]},
            {_attrs: ['metadata.shield'], _name: 'SEARCH.HISTORY.NBSHIELD', _type: 'TEXT', _isSortable: true},
            {_attrs: ['metadata.ambassadors'], _name: 'SEARCH.HISTORY.NBAMB', _type: 'TEXT', _isSortable: true},
          ]
        };
      });
  }

  openSidebar(request: any) {
    this._sidebarValue = {
      animate_state: 'active',
      title: request.keywords,
      size: '726px'
    };
    this._selectedRequest = request;
  }

  public updateInno(object: any) {
    if (object.value.length) {
      this._config.innovation = JSON.stringify({
        "$in": object.value.map((v: any) => v._id)
      });
    } else {
      delete this._config.innovation;
    }
    this.loadHistory();
  }

  public onClickActions(value: any) {
    const requestsIds = value._rows.map((r: any) => r._id);
    if (value._action === 'SEARCH.HISTORY.CANCEL') {
      this._searchService.cancelManyRequests(requestsIds).pipe(first()).subscribe((_: any) => {
        requestsIds.forEach((requestId : string) => {
          this._requests[this._getRequestIndex(requestId, this._requests)].status = 'CANCELED';
        });
        this._notificationsService.success('Requêtes annulées', `Les requêtes ont bien été annulées`);
      });
    } else if (value._action === 'SEARCH.HISTORY.BACK_QUEUE') {
      this._searchService.queueManyRequests(requestsIds).pipe(first()).subscribe((_: any) => {
        requestsIds.forEach((requestId : string) => {
          const request = this._requests[this._getRequestIndex(requestId, this._requests)];
          if (request.status != "DONE") request.status = 'QUEUED';
        });
        this._notificationsService.success('Requêtes mises en attente', `Les requêtes ont bien été mises en attente`);
      });
    } else if (value._action === 'SEARCH.HISTORY.STOP') {
      this._searchService.stopManyRequests(requestsIds).pipe(first()).subscribe((_: any) => {
        requestsIds.forEach((requestId : string) => {
          const request = this._requests[this._getRequestIndex(requestId, this._requests)];
          request.status = 'DONE';
        });
        this._notificationsService.success('Requêtes arrêtées', `Les requêtes ont bien été arrêtées`);
      });
    }  else if (value._action === 'SEARCH.HISTORY.SEARCH_MAILS') {
      requestsIds.forEach((requestId: string) => {
        const params: any = {
          requestId: requestId,
          query: {
            motherRequestId: requestId
          },
          all: true
        };

        this._searchService.searchMails(params).subscribe((result: any) => {
          this._notificationsService.success('Recherche lancée', `La recherche de mails a été lancée`);
        });
      });
    } else {
      this._requestsToImport = requestsIds;
      this._addToCampaignModal = true;
    }
  }

  updateCampaign(event: any) {
    if (Array.isArray(event.value)) {
      if (event.value.length > 0) {
        this._campaignService.get(event.value[0]._id).subscribe((campaign) => {
          this._geography = {
            include: campaign.targetCountries.map((country) => { return {code: country}; }),
            exclude: [],
            continentTarget: SharedWorldmapService.setContinents(false)
          };
          this._chosenCampaign = campaign;
        });
      } else {
        this._chosenCampaign = undefined;
      }
    }
  }

  addToCampaign(campaign: Campaign, goToCampaign?: boolean) {
    this._addToCampaignModal = false;
    const params: any = {
      newCampaignId: campaign._id,
      newInnovationId: campaign.innovation._id,
      requestIds: this._requestsToImport,
      launchNewRequests: this._launchNewRequests,
      newTargetCountries: this._geography.include.map((country) => country.code)
    };
    this._professionalsService.addFromHistory(params).subscribe((result: any) => {
      this._notificationsService.success(
        'Import des requêtes en cours',
        'Les pros seront bien déplacés d\'ici quelques minutes');
      if (goToCampaign) {
        this._router.navigate([`/user/admin/campaigns/campaign/${campaign._id}/pros`]);
      }
      this._requestsToImport = [];
    });
  }

  public relaunchRequests() {
    this._searchService.relaunchRequests().pipe(first()).subscribe((_: any) => {
      this.loadHistory();
    });
  }

  public getGoogleQuota() {
    this._searchService.dailyStats().pipe(first()).subscribe((result: any) => {
      this._googleQuota = 30000;
      if (result.hours) {
        this._googleQuota -= result.hours.slice(7).reduce((sum: number, hour: any) => sum + hour.googleQueries, 0)
      }
    });
  }

  private _getRequestIndex(requestId: string, array: Array<any>): number {
    for (const request of array) {
      if (requestId === request._id) {
        return array.indexOf(request);
      }
    }
  }

  private _keywordsSuggestion(query: string) {
    const byCount = function(array: Array<any>) {
      let itm, a = [], L = array.length, o = {};
      for (let i = 0; i < L; i++) {
        itm = array[i];
        if (!itm) {continue; }
        if (o[itm] === undefined) {o[itm] = 1; } else {++o[itm]; }
      }
      for (let p in o) {a[a.length] = p; }
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

  get googleQuota(): number {
    return this._googleQuota;
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    const tmp = JSON.parse(value.search);
    this.loadHistory();
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
  get addToCampaignModal () {
    return this._addToCampaignModal;
  }

  set addToCampaignModal(value: boolean) {
    this._addToCampaignModal = value;
  }

  get geography() {
    return this._geography;
  }

  set geography(value: GeographySettings) {
    this._geography = value;
  }

  get suggestions() {
    return this._suggestedKeywords;
  }

  get launchNewRequests(): boolean {
    return this._launchNewRequests;
  }

  set launchNewRequests(value: boolean) {
    this._launchNewRequests = value;
  }
}
