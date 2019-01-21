import { Component, Output, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { TagsService } from '../../../../../../services/tags/tags.service';
import { TagAttachment } from '../../../../../../models/tag-attachment';
import { Tag } from '../../../../../../models/tag';
import { MultilingPipe } from '../../../../../../pipe/pipes/multiling.pipe';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-admin-tag-new',
  templateUrl: 'admin-tag-new.component.html',
  styleUrls: ['admin-tag-new.component.scss']
})
export class AdminTagNewComponent {

  @Input()
  set showForm(value: boolean) { this._showForm = value; }

  @Input()
  set attachmentInitialData( data: Array<TagAttachment>) {
    this._addAttachmentConfig.initialData = data;
  }

  @Output() public result: Tag;

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

  private _showForm = false;

  private _codeTypes = [
    {'name': 'ISIC', 'value': 'isic'},
    {'name': 'NAICS', 'value': 'naiccs'},
    {'name': 'Thomson Reuters', 'value': 'threuters'},
  ];

  public formData: FormGroup = new FormGroup({
    label: new FormGroup({
      en: new FormControl(),
      fr: new FormControl()
    }),
    description: new FormGroup({
      en: new FormControl(),
      fr: new FormControl()
    }),
    attachments: new FormControl(),
    type: new FormControl()
  });

  constructor(private _tagsService: TagsService,
              private _translateService: TranslateService,
              private _notificationsService: TranslateNotificationsService) {}

  public onSubmit(_event: any) {
    this._tagsService.create(this.formData.value)
      .pipe(first())
      .subscribe((result: any) => {
        if (result) {
          this.result = result;
          const t_label = MultilingPipe.prototype.transform(result.label, this._translateService.currentLang);
          this._notificationsService.success('Tag creation', `The tag ${t_label} was created.`);
        } else {
          this._notificationsService.error('ERROR.ERROR', 'Empty response from server');
        }
        }, (error: any) => {
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

}
