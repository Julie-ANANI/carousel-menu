import { Component, Output, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { TagsService } from '../../../../../../services/tags/tags.service';
import { IndexService } from '../../../../../../services/index/index.service';
import { SearchService } from '../../../../../../services/search/search.service';
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
    entry: new FormGroup({
      en: new FormGroup({
        label: new FormControl(),
        description: new FormControl()
      }),
      fr: new FormGroup({
        label: new FormControl(),
        description: new FormControl()
      })
    }),
    attachments: new FormControl(),
    type: new FormControl()
  });

  constructor(private _tagsService: TagsService,
              private _indexService: IndexService,
              private _searchService: SearchService,
              private _translateService: TranslateService,
              private _multiling: MultilingPipe,
              private _notificationsService: TranslateNotificationsService) {}

  public onSubmit(_event: any) {
    const _tagObject = this.formData.value
    const en = _tagObject.entry['en'];
    en['lang'] = 'en';
    const fr = _tagObject.entry['fr'];
    fr['lang'] = 'en';
    _tagObject.entry = [en, fr];
    console.log(_tagObject);
    this._tagsService.create(_tagObject)
      .pipe(first())
      .subscribe((result: any) => {
        if (result) {
          this.result = result;
          const t_label = this._multiling.transform(result.label, this._translateService.currentLang);
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

  public exportTags() {
    this._tagsService.exportTags();
  }
  public importTags(file: File) {
    this._tagsService.importTags(file).subscribe(() => {
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.TAGS.IMPORTED');
    }, () => {
      this._notificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  public resetIndex() {
    this._indexService.resetElasticsearch().subscribe((value) => {
      console.log(value);
    });
  }

  public loadMappings() {
    this._indexService.loadMappings().subscribe((value) => {
      console.log(value);
    });
  }

  public loadData() {
    this._searchService.loadRequestIndex().subscribe((value) => {
      console.log(value);
    });
  }


  get codeTypes(): Array<any> { return this._codeTypes; }

  get addAttachmentConfig() { return this._addAttachmentConfig; }

  get showForm(): boolean { return this._showForm; }

}
