import { Component, OnInit } from '@angular/core';

import { Tag } from '../../../../../models/tag';

import { TagsService } from '../../../../../services/tags/tags.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';


@Component({
  selector: 'app-admin-tag-attachment-list',
  templateUrl: 'admin-tag-attachment-list.component.html',
  styleUrls: ['admin-tag-attachment-list.component.scss']
})
export class AdminTagAttachmentsListComponent implements OnInit{

  private _dataset: {result: Array<Tag>, _metadata:any};

  private _config = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      label: -1
    }
  };

  constructor(private _tagsService: TagsService,
              private _notificationsService: TranslateNotificationsService) {}


  ngOnInit(): void {
    this._dataset = {
      result: [],
      _metadata: {
        totalCount: 0
      }
    };
    console.log(this._tagsService);
    console.log(this._notificationsService);
  }

  public createTag(data: any) {
    console.log(data);
  }

  get data(): Array<Tag> { return this._dataset.result; };
  get metadata(): any { return this._dataset._metadata; };
  get config(): any { return this._config; };
  set config(value: any) { this._config = value; };
  get total(): number { return this._dataset._metadata.totalCount; };
}
