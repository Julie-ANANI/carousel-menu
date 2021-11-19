import { Component, OnInit } from '@angular/core';

import { Tag } from '../../../../../../models/tag';

@Component({
  selector: 'app-admin-tag-attachment-list',
  template:
  `
    <div>
      <h4>Thompson Reuters Attachments</h4>
      <attachment-subset [type]="'threuters'"></attachment-subset>
    </div>

  `,
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

  constructor() {}

  ngOnInit(): void {
    this._dataset = {
      result: [],
      _metadata: {
        totalCount: 0
      }
    };
  }

  get data(): Array<Tag> { return this._dataset.result; };
  get metadata(): any { return this._dataset._metadata; };
  get config(): any { return this._config; };
  set config(value: any) { this._config = value; };
  get total(): number { return this._dataset._metadata.totalCount; };
}
