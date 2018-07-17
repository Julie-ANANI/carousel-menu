import { Component, OnInit } from '@angular/core';

import { Tag } from '../../../../../models/tag';
import { TagAttachment } from '../../../../../models/tag-attachment';

import { MultilingPipe } from '../../../../../pipe/pipes/multiling.pipe';
import { TagsService } from '../../../../../services/tags/tags.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';


@Component({
  selector: 'app-admin-tag-list',
  templateUrl: 'admin-tag-list.component.html',
  styleUrls: ['admin-tag-list.component.scss']
})
export class AdminTagListComponent implements OnInit {

  private _dataset: {result: Array<Tag>, _metadata: any};

  private _config = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      label: -1
    }
  };

  private _addAttachmentConfig: {
    placeholder: string,
    initialData: Array<TagAttachment>,
    type: string,
    identifier: string,
    canOrder: boolean
  } = {
    placeholder: 'Economic sector attachment',
    initialData: [],
    type: 'threuters',
    identifier: 'text',
    canOrder: false
  };

  public editDatum: {[propString: string]: boolean} = {};

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
    this.loadData(null);
  }

  public loadData(config: any) {
    this._config = config || this._config;
    this._tagsService.getAll(config).subscribe(result=>{
      if(result) {
        this._dataset = result;
      }
    });
  }

  public updateEntry(datum: any, event: Event) {
    event.preventDefault();
    this._tagsService.save(datum._id, datum)
        .subscribe((result) => {
          if (result) {
            const t_label = MultilingPipe.prototype.transform(result.label, this._translateService.currentLang);
            this._notificationsService.success('Tag update', `The tag ${t_label} has been updated.`);
          } else {
            this._notificationsService.error('ERROR.ERROR', 'Empty response from server');
          }
        }, (error) => {
          error = JSON.parse(error);
          this._notificationsService.error('ERROR.ERROR', error.message);
        });
    this.editDatum[datum._id] = false;
  }

  public buildAttachmentsListConfig( initialData: Array<any>): any {
    this._addAttachmentConfig.initialData = initialData || [];
    return this._addAttachmentConfig;
  }

  public addAttachment(event: any, datum: any) {
    datum.attachments = event.value;
  }

  get data(): Array<Tag> { return this._dataset.result; };
  get metadata(): any { return this._dataset._metadata; };
  get config(): any { return this._config; };
  set config(value: any) { this._config = value; };
  get total(): number { return this._dataset._metadata.totalCount; };
  get lang(): string { return this._translateService.currentLang; };
}
