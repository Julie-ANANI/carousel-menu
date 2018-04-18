import { Component, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';

import { TagsService } from './../../../../../services/tags/tags.service';

import { TagAttachment } from './../../../../../models/tag-attachment';
import { Tag } from './../../../../../models/tag';

@Component({
  selector: 'app-admin-tag-new',
  templateUrl: 'admin-tag-new.component.html',
  styleUrls: ['admin-tag-new.component.scss']
})
export class AdminTagNewComponent {

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

  private _showForm: boolean = false;

  private _codeTypes = [
    {'name': 'ISIC', 'value': 'isic'},
    {'name': 'NAICS', 'value': 'naiccs'},
    {'name': 'Thomson Reuters', 'value': 'threuters'},
  ];

  public formData: FormGroup = this._formBuilder.group({
    label: ['', Validators.required],
    attachments: [[]],
    description: ['']
  });

  @Output() public result: Tag;

  constructor(private _formBuilder: FormBuilder,
              private _tagsService: TagsService,
              private _notificationsService: TranslateNotificationsService) {}

  public onSubmit(event: any) {
    this._tagsService.create(this.formData.value).subscribe(result=>{
      if(result) {
        this.result = result;
        this._notificationsService.success("Tag creation", `The tag ${result.label} was created.`);
      } else {
        this._notificationsService.error('ERROR.ERROR', "Empty response from server");
      }
    }, error => {
      error = JSON.parse(error);
      this._notificationsService.error('ERROR.ERROR', error.message);
    });
    this._showForm = false;
  }

  public addAttachment(event: any): void {
    this.formData.get('attachments').setValue(event.value);
  }

  get codeTypes(): Array<any> { return this._codeTypes; }

  get addAttachmentConfig() { return this._addAttachmentConfig; }

  get showForm(): boolean { return this._showForm; }

  @Input()
  set showForm(value: boolean) { this._showForm = value; }

  @Input()
  set attachmentInitialData( data: Array<TagAttachment>) {
    this._addAttachmentConfig.initialData = data;
  }
}
