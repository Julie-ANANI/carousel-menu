import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import { Table, Config } from '@umius/umi-common-component/models';

@Component({
  selector: 'app-sidebar-search-tool',
  templateUrl: './sidebar-search-tool.component.html',
  styleUrls: ['./sidebar-search-tool.component.scss']
})

export class SidebarSearchToolComponent {

  @Input() set searchFieldValue(value: string) {
    this._searchFieldValue = value;
  }

  @Input() set sidebarState(value: string) {
    if (value ===  'active' || value === undefined) {
      this.loadHistory(this._config);
    }
  }

  @Output() onSaveRequest = new EventEmitter();

  @Output() onDownload = new EventEmitter();

  @Output() onUpload = new EventEmitter <File>();

  @Output() onLoadRequest = new EventEmitter <any>();

  private _config: Config = {
    fields: "keywords user created expireAt metadata",
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  private _tableInfos: Table;

  private _total: number;

  private _requests: Array <any> = [];

  private _searchFieldValue: string;

  constructor(private _searchService: SearchService,
              private _translateNotificationsService: TranslateNotificationsService) { }


  public loadHistory(config: Config) {
    this._config = config;

    this._searchService.getMetadataRequests(this._config).subscribe((result: any) => {

      if (result.metadatarequests) {
        this._requests = result.metadatarequests.map((request: any) => {
          request.saved = !request.expireAt;
          return request;
        });
      }

      this._total = result._metadata && result._metadata.totalCount ? result._metadata.totalCount : 0;

      this._tableInfos = {
        _selector: 'metadataRequests-history',
        _title: 'TABLE.TITLE.REQUESTS',
        _content: this._requests,
        _total: this._total,
        _isSearchable: true,
        _isTitle: true,
        _clickIndex: 1,
        _editButtonLabel: 'Load',
        _isPaginable: true,
        _columns: [
          {_attrs: ['keywords'], _name: 'Keywords', _type: 'TEXT', _isSortable: true, _isSearchable: true},
          {_attrs: ['user'], _name: 'TABLE.HEADING.OWNER', _type: 'TEXT', _isSearchable: true, _isSortable: true},
          {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE'},
          {_attrs: ['saved'], _name: 'TABLE.HEADING.SAVED', _type: 'CHECK'},
        ]
      };

    }, () => {
      this._translateNotificationsService.error("ERROR.ERROR", "ERROR.FETCHING_ERROR");
    });
  }


  public onClickEdit(request: any) {
    this.onLoadRequest.emit(request._id);
  }


  public saveRequest() {
    this.onSaveRequest.emit();
  }


  public downloadRequest() {
    this.onDownload.emit();
  }


  public uploadRequest(file: File, event: Event) {
    event.preventDefault();
    this.onUpload.emit(file);
  }


  get total() {
    return this._total;
  }

  get requests() {
    return this._requests;
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    this.loadHistory(this._config);
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get searchFieldValue(): string {
    return this._searchFieldValue;
  }

}

