import { Component, OnInit, Input } from '@angular/core';

import { TagsService } from '../../../../../../services/tags/tags.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';


@Component({
  selector: 'attachment-subset',
  templateUrl: 'admin-tag-attachment-subset.component.html',
  styleUrls: ['admin-tag-attachment-subset.component.scss']
})
export class AdminTagAttachmentsSubsetComponent implements OnInit{

  /**
   * This is used to configure the query to puul the correct set of codes
   */
  @Input() public type: any;

  private _dataset: {result: Array<any>, _metadata:any};

  private _config = {
    limit: 10,
    offset: 0
  };

  constructor(private _tagsService: TagsService,
              private _translateService: TranslateService,
              private _notificationsService: TranslateNotificationsService) {}


  ngOnInit(): void {
    this._dataset = {
      result: [],
      _metadata: {
        totalCount: 0
      }
    };
    this.loadData();
    console.log(this._translateService);
    console.log(this._notificationsService);
  }

  public loadData() {
    this._tagsService.getAttachments(this.type||'').subscribe(result=>{
      if(result) {
        this._dataset = result;
      }
    }, error=>{
      this._notificationsService.error('Attachments', "Error loading some attachments of type " + this.type);
      console.error(error);
    });
  }


  get data(): Array<any> {
    const limit = this._config.limit || -1;
    const start = this._config.offset || 0;
    return this._dataset.result.slice(start, (start+limit));
  };
  get metadata(): any { return this._dataset._metadata; };
  get config(): any { return this._config; };
  set config(value: any) { this._config = value; };
  get total(): number { return this._dataset._metadata.totalCount; };
}
