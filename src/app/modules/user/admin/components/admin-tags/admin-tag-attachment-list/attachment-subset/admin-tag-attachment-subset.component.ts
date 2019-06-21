import { Component, OnInit, Input } from '@angular/core';

import { TagsService } from '../../../../../../../services/tags/tags.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';


@Component({
  selector: 'attachment-subset',
  templateUrl: 'admin-tag-attachment-subset.component.html',
  styleUrls: ['admin-tag-attachment-subset.component.scss']
})
export class AdminTagAttachmentsSubsetComponent implements OnInit {

  /**
   * This is used to configure the query to pull the correct set of codes
   */
  @Input() public type: any;

  @Input() public selectFn: any;

  private _dataset: {result: Array<any>, _metadata: any};

  private _config = {
    limit: 10,
    offset: 0
  };

  private _filter = {
    text: '',
    notation: ''
  };

  private _activeNTM = false;

  constructor(private _tagsService: TagsService,
              private _notificationsService: TranslateNotificationsService) {}


  ngOnInit(): void {
    this._dataset = {
      result: [],
      _metadata: {
        totalCount: 0
      }
    };
    this.loadData();
  }

  public loadData() {
    this._tagsService.getAttachments(this.type || '').subscribe((result: any) => {
      if (result) {
        this._dataset = result;
      }
    }, (error: any) => {
      this._notificationsService.error('Attachments', 'Error loading some attachments of type ' + this.type);
      console.error(error);
    });
  }

  configChange(value: any) {

    this._config = value;
    window.scroll(0, 0);
    this.loadData();
  }

  public selectDatum(datum: any) {
    datum.isSelected = !datum.isSelected;
  }

  public createTagFromCodes() {
    this._activeNTM = true;
  }

  get selected(): Array<any> {
    return this._dataset.result.filter(datum => !!TableComponent.isSelected);
  }

  get activeNTM(): boolean { return this._activeNTM; }

  get data(): Array<any> { return this._dataset.result; };

  get config(): any { return this._config; };
  set config(value: any) { this._config = value; };

  get total(): number { return this._dataset._metadata.totalCount; };

  get filter(): any { return this._filter; }
  set filter(value: any) { this._filter = value; }
}
