import { Component, OnInit } from '@angular/core';
import { ShowcaseService } from '../../../demo/components/showcase/services/showcase.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Config } from '../../../../models/config';
import {Table} from "../../../table/models/table";
import {Showcase} from "../../../../models/showcase";

@Component({
  selector: 'app-sidebar-showcase-history',
  templateUrl: './showcase-history.component.html',
  styleUrls: ['./showcase-history.component.scss']
})

export class ShowcaseHistoryComponent implements OnInit {

  private _config: Config = {
    fields: 'name created',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _tableInfos: Table = {
    _selector: 'metadataRequests-history',
    _title: 'TABLE.TITLE.REQUESTS',
    _content: [],
    _total: 0,
    _isDeletable: true,
    _isSearchable: true,
    _isSelectable: true,
    _isTitle: true,
    _editIndex: 1,
    _editButtonLabel: 'Load',
    _isPaginable: true,
    _columns: [
      {_attrs: ['name'], _name: 'Name', _type: 'TEXT', _isSortable: true, _isSearchable: true},
      {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isSortable: true},
    ]
  };

  public showcaseName = '';

  constructor(private _showcaseService: ShowcaseService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this.loadShowcases();
  }

  public createShowcase(): void {
    const showcase = { name: this.showcaseName };
    this._showcaseService.create(showcase).subscribe((res) => {
      this.showcaseName = '';
      this._tableInfos._content.unshift(res);
      this._tableInfos._total++;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }

  public deleteShowcase(showcases: Array<Showcase>) {
    showcases.forEach((showcase) => {
      this._showcaseService.remove(showcase._id).subscribe((res) => {
        this._tableInfos._content = this._tableInfos._content.filter((s) => s._id !== res._id);
        this._tableInfos._total--;
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
      });
    });
  }

  public loadShowcase(showcase: Showcase) {
    console.log(showcase);
  }

  private loadShowcases() {
    this._showcaseService.getAll(this._config).subscribe((result) => {
      this._tableInfos._content = result.result;
      this._tableInfos._total = result._metadata.totalCount;
    }, (error) => {
      this._translateNotificationsService.error('ERROR.ERROR', error.message);
    });
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    this.loadShowcases();
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

}

