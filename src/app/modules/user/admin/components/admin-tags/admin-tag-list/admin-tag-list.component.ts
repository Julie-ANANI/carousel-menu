import { Component, OnInit } from '@angular/core';
import { Tag } from '../../../../../../models/tag';
import { TagAttachment } from '../../../../../../models/tag-attachment';
import { TagsService } from '../../../../../../services/tags/tags.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { first } from 'rxjs/operators';
import {UmiusConfigInterface, UmiusPaginationInterface} from '@umius/umi-common-component';
import {LangEntryService} from '../../../../../../services/lang-entry/lang-entry.service';

@Component({
  selector: 'app-admin-tag-list',
  templateUrl: 'admin-tag-list.component.html',
})
export class AdminTagListComponent implements OnInit {

  private _data: Array<Tag> = [];
  total = 0;

  private _config: UmiusConfigInterface = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"label":-1}'
  };

  private _paginationConfig: UmiusPaginationInterface = {};

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
              private _langEntryService: LangEntryService,
              private _notificationsService: TranslateNotificationsService) {}


  ngOnInit(): void {
    this._paginationConfig = {limit: 10, offset: 0};
    this.loadData(this._config);
  }

  public loadData(config: any) {
    this._config = config;
    this._tagsService.getAll(this._config).pipe(first()).subscribe((result: any) => {
      if (result) {
        this._data = result.result;
        this.total = result._metadata.totalCount;
      }
    });
  }

  public onUpdateEntry(value: string, index: number, update: 'label' | 'description', lang: string) {
    const _index = LangEntryService.entryIndex(this._data[index].entry, 'lang', lang);
    if (_index !== -1) {
      this._data[index].entry[_index][update] = value;
    }
  }

  configChange(value: any) {
    this._paginationConfig = value;
    this._config.limit = value.limit;
    this._config.offset = value.offset;
    window.scroll(0, 0);
    this.loadData(this._config);
  }

  public updateEntry(datum: any, event: Event) {
    event.preventDefault();
    this._tagsService.save(datum._id, datum)
        .subscribe((result) => {
          if (result) {
            const t_label = this._langEntryService.tagEntry(result, 'label', this.lang);
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

  get data(): Array<Tag> { return this._data; };

  get config(): UmiusConfigInterface { return this._config; };

  set config(value: UmiusConfigInterface) {
    this._config = value;
  };

  get sortConfig(): string {
    return this._config.sort;
  }

  set sortConfig(value: string) {
    this._config.sort = value;
    this.loadData(this._config);
  }

  get paginationConfig(): UmiusPaginationInterface { return this._paginationConfig; }

  get lang(): string { return this._translateService.currentLang; };

}
