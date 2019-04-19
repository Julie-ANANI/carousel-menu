import { Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from "../../../../services/search/search.service";
import {Table} from "../../../table/models/table";

@Component({
  selector: 'app-sidebar-search-tool',
  templateUrl: './sidebar-search-tool.component.html',
  styleUrls: ['./sidebar-search-tool.component.scss']
})
export class SidebarSearchToolComponent {

  @Output() onSaveRequest = new EventEmitter();
  @Output() onDownload = new EventEmitter();
  @Output() onUpload = new EventEmitter <File>();
  @Output() onLoadRequest = new EventEmitter <any>();
  @Output() close = new EventEmitter <any>();

  private _config: any = {
    fields: "keywords user created expireAt metadata",
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  private _tableInfos: any = null;

  private _total = 0;

  private _requests: Array <any>;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.loadHistory(this._config);
  }

  public loadHistory(config: any) {
    this._config = config;
    this.searchService.getMetadataRequests(this._config).subscribe((result: any) => {
      this._requests = result.metadatarequests.map(request => {
        request.saved = !request.expireAt;
        return request;
      });
      this._total = result._metadata.totalCount;

      this._tableInfos = {
        _selector: 'metadataRequests-history',
        _title: 'SEARCH.REQUESTS',
        _content: this._requests,
        _total: this._total,
        _isHeadable: true,
        _isFiltrable: true,
        _isDeletable: false,
        _isSelectable: false,
        _isEditable: false,
        _actions: [],
        _editIndex: 2,
        _columns: [
          {_attrs: ['keywords'], _name: 'Keywords', _type: 'TEXT'},
          {_attrs: ['user'], _name: 'TABLE.HEADING.OWNER', _type: 'TEXT'},
          {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isFiltrable: false},
          {_attrs: ['saved'], _name: 'Saved', _type: 'CHECK', _isSortable: false, _isFiltrable: false},
        ]
      };

    });
  }

  onClickEdit(request) {
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

  get config() {
    return this._config;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

}

