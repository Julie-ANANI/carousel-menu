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
import { InnovationService } from "../../../../services/innovation/innovation.service";
import { Tag } from "../../../../models/tag";
import { TagsService } from "../../../../services/tags/tags.service";

@Component({
  selector: 'app-shared-search-history',
  templateUrl: './shared-search-history.component.html',
  styleUrls: ['./shared-search-history.component.scss']
})
export class SharedSearchHistoryComponent implements OnInit {

  @Input() campaignId: string;
  @Input() status: string;
  @Input() mails: boolean;

  private _tags: Array<Tag> = [];
  private _projects: Array<{name: string, _id: string}> = [];
  private _sidebarValue: SidebarInterface = {};
  private _tableInfos: Table;
  private _selectedRequest: any = null;
  private _requestsToImport: Array<any> = [];
  private _paused = false;
  private _requests: Array<any> = [];
  private _total = 0;
  private _googleQuota = 30000;
  private _config: Config = {
    fields: 'entity keywords created country elapsedTime status countries cost flag campaign innovation motherRequest totalResults metadata results',
    limit: "10",
    offset: "0",
    search: "{}",
    sort: '{ "created": -1 }'
  };
  private _chosenCampaign: Array<any> = [];
  private _addToCampaignModal: boolean = false;

  constructor(
    private _router: Router,
    private _searchService: SearchService,
    private _tagsService: TagsService,
    private _professionalsService: ProfessionalsService,
    private _innovationService: InnovationService,
    private _notificationsService: TranslateNotificationsService
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
    this.loadHistory();
  }

  public loadHistory() {
    this._searchService.getRequests(this._config)
      .pipe(first())
      .subscribe((result: any) => {
        if(result.requests) {
          this._requests = result.requests.map((request: any) => {
            request.pros = (request.results.person.length || request.totalResults || 0) + " pros";
            if (request.countries && request.countries.length) {
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
            } else if (request.country) {
              request.targetting = countries[request.country];
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
            { _icon: 'fas fa-share-square', _label: 'SEARCH.ADDTOCAMPAIGN' }
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
    this._projects = object.value;
    if (this._projects.length) {
      this._config.innovation = JSON.stringify({
        "$in": this._projects.map((v: any) => v._id)
      });
    } else {
      delete this._config.innovation;
    }
    this.loadHistory();
  }

  public onAddTag(value: any) {
    const id = value.tag ? value.tag : value._id;

    this._tagsService.get(id).pipe(first()).subscribe((res: any) => {
      this._tags.push(res.tags[0]);
      this._updateInnoByTag();
    }, () => {
      this._notificationsService.error('ERROR.ERROR', 'ERROR.TAGS.TAG_FETCHING_ERROR');
    });
  }

  public onRemoveTag(tag: any) {
    this._tags.splice(this._tags.findIndex(value => value._id === tag._id), 1);
  }

  private _updateInnoByTag() {
    const config: Config = {
      fields: 'name',
      limit: '0',
      offset: '',
      search: '{}',
      tags: this._tags[0]._id,
      sort: '{ "created": -1 }'
    };
    const self = this;
    const tmp = [...this._projects];
    this._projects = [];
    this._innovationService.getAll(config).pipe(first()).subscribe((innovations: any) => {
      innovations.result.forEach((project: any) => {
        if (tmp.findIndex(p => p._id === project._id) === -1) {
          tmp.push(project);
        }
      });
      self.updateInno({value: tmp});
    });
  }


  public innoAutoCompleteConfig (): {placeholder: string, type: string, initialData: Array<any>} {
    return {
      placeholder: 'Innovation',
      type: 'innovation',
      initialData: this._projects};
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
          const request = this._requests[this._getRequestIndex(requestId, this._requests)]
          if (request.status != "DONE") request.status = 'QUEUED';
        });
        this._notificationsService.success('Requêtes mises en attente', `Les requêtes ont bien été mises en attente`);
      });
    } else {
      this._requestsToImport = requestsIds;
      this._addToCampaignModal = true;
    }
  }

  updateCampaign(event: any) {
    this._chosenCampaign = event.value;
  }

  addToCampaign(campaigns: Array<Campaign>, goToCampaign?: boolean) {
    this._addToCampaignModal = false;
    const campaign = campaigns[0];
    const params: any = {
      newCampaignId: campaign._id,
      newInnovationId: campaign.innovation,
      requestIds: this._requestsToImport,
    };
    this._professionalsService.addFromHistory(params).subscribe((result: any) => {
      this._notificationsService.success('Déplacement des pros', `${result.nbProfessionalsMoved} pros ont été déplacés`);
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
    this.loadHistory();
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
  get chosenCampaign(): Array<any> {
    return this._chosenCampaign;
  }
  get addToCampaignModal () {
    return this._addToCampaignModal;
  }
  get tags () {
    return this._tags;
  }
}
