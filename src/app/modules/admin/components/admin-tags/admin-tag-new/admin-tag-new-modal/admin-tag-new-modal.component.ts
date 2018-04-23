import { Component, Input } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/*import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';

import { TagsService } from './../../../../../services/tags/tags.service';

import { TagAttachment } from './../../../../../models/tag-attachment';
import { Tag } from './../../../../../models/tag';*/

@Component({
  selector: 'app-admin-tag-new-modal',
  templateUrl: 'admin-tag-new-modal.component.html',
  styleUrls: ['admin-tag-new-modal.component.scss']
})
export class AdminTagNewModalComponent {

  @Input() public title: string;

  private _active: boolean = false;
  private _initialData: Array<any> = [];

  constructor() {}

  get active(): boolean { return this._active; }

  get initialData(): Array<any> { return this._initialData; }

  @Input()
  set initialData(data: Array<any>) {
    this._initialData = data;
  }

  @Input()
  set active(data: boolean) {
    console.log("set as active..." + data);
    this._active = data;
  }

}
